extern crate std;

use super::*;
use crate::error::ContractError;
use soroban_sdk::testutils::{Address as _, EnvTestConfig, Events as _, Ledger};
use soroban_sdk::{symbol_short, token, Address, Env, Symbol, TryFromVal};
use std::vec::Vec;
use stellar_fund_stf_token::{StfTokenContract, StfTokenContractClient};

fn setup() -> (
    Env,
    Address,
    Address,
    StellarFundContractClient<'static>,
    token::TokenClient<'static>,
    token::StellarAssetClient<'static>,
    StfTokenContractClient<'static>,
    Address,
    Address,
    Address,
) {
    let env = Env::new_with_config(EnvTestConfig {
        capture_snapshot_at_drop: false,
    });
    env.mock_all_auths_allowing_non_root_auth();
    env.ledger().set_sequence_number(100);

    let payment_admin = Address::generate(&env);
    let payment_asset = env.register_stellar_asset_contract_v2(payment_admin);
    let payment_token_id = payment_asset.address();

    let reward_admin = Address::generate(&env);
    let reward_token_id = env.register_contract(None, StfTokenContract);
    let reward_token = StfTokenContractClient::new(&env, &reward_token_id);
    reward_token.initialize(
        &reward_admin,
        &soroban_sdk::String::from_str(&env, "StellarFund Token"),
        &soroban_sdk::String::from_str(&env, "STF"),
        &7_u32,
    );

    let contract_id = env.register_contract(None, StellarFundContract);
    let contract = StellarFundContractClient::new(&env, &contract_id);
    contract.initialize(&reward_admin, &reward_token_id, &250_i128);

    let payment_token = token::TokenClient::new(&env, &payment_token_id);
    let payment_admin_client = token::StellarAssetClient::new(&env, &payment_token_id);

    let client = Address::generate(&env);
    let freelancer = Address::generate(&env);

    payment_admin_client.mint(&client, &5_000);
    reward_token.mint(&contract_id, &5_000);

    (
        env,
        contract_id,
        payment_token_id,
        contract,
        payment_token,
        payment_admin_client,
        reward_token,
        reward_admin,
        client,
        freelancer,
    )
}

#[test]
fn test_create_escrow() {
    let (env, contract_id, payment_token_id, contract, payment_token, _, _, _, client, freelancer) =
        setup();

    let escrow_id = contract.create_escrow(&client, &freelancer, &payment_token_id, &1_250);
    let escrow = contract.get_escrow(&escrow_id);

    assert_eq!(escrow_id, 1);
    assert_eq!(escrow.id, 1);
    assert_eq!(escrow.client, client.clone());
    assert_eq!(escrow.freelancer, freelancer.clone());
    assert_eq!(escrow.token, payment_token_id.clone());
    assert_eq!(escrow.amount, 1_250);
    assert_eq!(escrow.status, Status::Active);
    assert_eq!(payment_token.balance(&client), 3_750);
    assert_eq!(payment_token.balance(&contract_id), 1_250);
    assert_eq!(contract.get_next_escrow_id(), 2);

    let last_event = env.events().all().last().unwrap().clone();
    assert_eq!(last_event.0, contract_id);
}

#[test]
fn test_release_payment() {
    let (_env, contract_id, payment_token_id, contract, payment_token, _, reward_token, _, client, freelancer) =
        setup();

    let escrow_id = contract.create_escrow(&client, &freelancer, &payment_token_id, &800);
    contract.release_payment(&escrow_id, &client);

    let escrow = contract.get_escrow(&escrow_id);
    assert_eq!(escrow.status, Status::Completed);
    assert_eq!(payment_token.balance(&contract_id), 0);
    assert_eq!(payment_token.balance(&freelancer), 800);
    assert_eq!(reward_token.balance(&freelancer), 250);
}

#[test]
fn test_refund() {
    let (_env, contract_id, payment_token_id, contract, payment_token, _, reward_token, _, client, freelancer) =
        setup();

    let escrow_id = contract.create_escrow(&client, &freelancer, &payment_token_id, &900);
    contract.refund(&escrow_id, &client);

    let escrow = contract.get_escrow(&escrow_id);
    assert_eq!(escrow.status, Status::Cancelled);
    assert_eq!(payment_token.balance(&contract_id), 0);
    assert_eq!(payment_token.balance(&client), 5_000);
    assert_eq!(reward_token.balance(&freelancer), 0);
}

#[test]
fn test_release_requires_original_client() {
    let (env, _, payment_token_id, contract, _, _, _, _, client, freelancer) = setup();
    let attacker = Address::generate(&env);
    let escrow_id = contract.create_escrow(&client, &freelancer, &payment_token_id, &600);

    let err = contract.try_release_payment(&escrow_id, &attacker).unwrap_err();
    assert_eq!(err, Ok(ContractError::Unauthorized));
}

#[test]
fn test_invalid_amount_is_rejected() {
    let (_env, _, payment_token_id, contract, _, _, _, _, client, freelancer) = setup();

    let err = contract
        .try_create_escrow(&client, &freelancer, &payment_token_id, &0)
        .unwrap_err();
    assert_eq!(err, Ok(ContractError::InvalidAmount));
}

#[test]
fn test_create_release_and_refund_emit_events() {
    let (env, contract_id, payment_token_id, contract, _, _, _, _, client, freelancer) = setup();

    let escrow_id = contract.create_escrow(&client, &freelancer, &payment_token_id, &333);
    contract.release_payment(&escrow_id, &client);

    let refund_id = contract.create_escrow(&client, &freelancer, &payment_token_id, &222);
    contract.refund(&refund_id, &client);

    let events = env.events().all();
    let mut escrow_event_topics = Vec::new();

    for idx in 0..events.len() {
        let event = events.get(idx).unwrap();
        if event.0 != contract_id {
            continue;
        }

        if let Ok(topic) = Symbol::try_from_val(&env, &event.1.get(0).unwrap()) {
            escrow_event_topics.push(topic);
        }
    }

    assert_eq!(escrow_event_topics.len(), 4);
    assert_eq!(escrow_event_topics[0], symbol_short!("created"));
    assert_eq!(escrow_event_topics[1], symbol_short!("released"));
    assert_eq!(escrow_event_topics[2], symbol_short!("created"));
    assert_eq!(escrow_event_topics[3], symbol_short!("refunded"));
}
