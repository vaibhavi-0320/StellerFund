use super::*;
use soroban_sdk::testutils::{Address as _, EnvTestConfig, Ledger};
use soroban_sdk::{token, Address, Env};

fn setup() -> (
    Env,
    Address,
    Address,
    StellarFundContractClient<'static>,
    token::TokenClient<'static>,
    token::StellarAssetClient<'static>,
    Address,
    Address,
) {
    let env = Env::new_with_config(EnvTestConfig {
        capture_snapshot_at_drop: false,
    });
    env.mock_all_auths_allowing_non_root_auth();
    env.ledger().set_sequence_number(100);

    let token_admin = Address::generate(&env);
    let asset = env.register_stellar_asset_contract_v2(token_admin);
    let token_id = asset.address();

    let contract_id = env.register_contract(None, StellarFundContract);
    let contract = StellarFundContractClient::new(&env, &contract_id);

    let token_client = token::TokenClient::new(&env, &token_id);
    let token_admin_client = token::StellarAssetClient::new(&env, &token_id);

    let client = Address::generate(&env);
    let freelancer = Address::generate(&env);

    token_admin_client.mint(&client, &5_000);

    (
        env,
        contract_id,
        token_id,
        contract,
        token_client,
        token_admin_client,
        client,
        freelancer,
    )
}

#[test]
fn test_create_escrow_locks_native_balance_and_generates_id() {
    let (_env, contract_id, token_id, contract, token_client, _token_admin, client, freelancer) =
        setup();

    let escrow_id = contract.create_escrow(&client, &freelancer, &token_id, &1_250);
    let escrow = contract.get_escrow(&escrow_id);

    assert_eq!(escrow_id, 1);
    assert_eq!(escrow.id, 1);
    assert_eq!(escrow.client, client.clone());
    assert_eq!(escrow.freelancer, freelancer.clone());
    assert_eq!(escrow.token, token_id.clone());
    assert_eq!(escrow.amount, 1_250);
    assert_eq!(escrow.status, Status::Active);
    assert_eq!(token_client.balance(&client), 3_750);
    assert_eq!(token_client.balance(&contract_id), 1_250);
    assert_eq!(contract.get_next_escrow_id(), 2);
}

#[test]
fn test_release_transfers_funds_to_freelancer() {
    let (_env, contract_id, token_id, contract, token_client, _token_admin, client, freelancer) =
        setup();

    let escrow_id = contract.create_escrow(&client, &freelancer, &token_id, &800);
    contract.release_payment(&escrow_id, &client);

    let escrow = contract.get_escrow(&escrow_id);
    assert_eq!(escrow.status, Status::Completed);
    assert_eq!(token_client.balance(&contract_id), 0);
    assert_eq!(token_client.balance(&freelancer), 800);
}

#[test]
#[should_panic(expected = "Unauthorized")]
fn test_only_original_client_can_release() {
    let (env, _contract_id, token_id, contract, _token_client, _token_admin, client, freelancer) =
        setup();
    let escrow_id = contract.create_escrow(&client, &freelancer, &token_id, &600);
    let attacker = Address::generate(&env);

    contract.release_payment(&escrow_id, &attacker);
}

#[test]
#[should_panic(expected = "not active")]
fn test_cannot_release_twice() {
    let (_env, _contract_id, token_id, contract, _token_client, _token_admin, client, freelancer) =
        setup();

    let escrow_id = contract.create_escrow(&client, &freelancer, &token_id, &500);
    contract.release_payment(&escrow_id, &client);
    contract.release_payment(&escrow_id, &client);
}

#[test]
fn test_refund_returns_funds_to_client() {
    let (_env, contract_id, token_id, contract, token_client, _token_admin, client, freelancer) =
        setup();

    let escrow_id = contract.create_escrow(&client, &freelancer, &token_id, &900);
    contract.refund(&escrow_id, &client);

    let escrow = contract.get_escrow(&escrow_id);
    assert_eq!(escrow.status, Status::Cancelled);
    assert_eq!(token_client.balance(&contract_id), 0);
    assert_eq!(token_client.balance(&client), 5_000);
}

#[test]
fn test_escrow_ids_increment() {
    let (_env, _contract_id, token_id, contract, _token_client, _token_admin, client, freelancer) =
        setup();

    let first = contract.create_escrow(&client, &freelancer, &token_id, &100);
    let second = contract.create_escrow(&client, &freelancer, &token_id, &200);

    assert_eq!(first, 1);
    assert_eq!(second, 2);
    assert_eq!(contract.get_next_escrow_id(), 3);
}
