use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env};

#[test]
fn test_create_escrow() {
    let env = Env::default();
    let contract_id = env.register_contract(None, EscrowContract);
    let client = EscrowContractClient::new(&env, &contract_id);

    let client_addr = Address::generate(&env);
    let freelancer_addr = Address::generate(&env);

    env.mock_all_auths();

    let escrow_id = client.create_escrow(&client_addr, &freelancer_addr, &1000);
    assert_eq!(escrow_id, 1);

    let escrow = client.get_escrow(&escrow_id);
    assert_eq!(escrow.amount, 1000);
    assert_eq!(escrow.released, false);
}

#[test]
fn test_release_escrow() {
    let env = Env::default();
    let contract_id = env.register_contract(None, EscrowContract);
    let client = EscrowContractClient::new(&env, &contract_id);

    let client_addr = Address::generate(&env);
    let freelancer_addr = Address::generate(&env);

    env.mock_all_auths();

    let escrow_id = client.create_escrow(&client_addr, &freelancer_addr, &1000);
    client.release_escrow(&client_addr, &escrow_id);

    let escrow = client.get_escrow(&escrow_id);
    assert_eq!(escrow.released, true);
}

#[test]
#[should_panic(expected = "InvalidAmount")]
fn test_invalid_amount() {
    let env = Env::default();
    let contract_id = env.register_contract(None, EscrowContract);
    let client = EscrowContractClient::new(&env, &contract_id);

    let client_addr = Address::generate(&env);
    let freelancer_addr = Address::generate(&env);

    env.mock_all_auths();

    client.create_escrow(&client_addr, &freelancer_addr, &0);
}
