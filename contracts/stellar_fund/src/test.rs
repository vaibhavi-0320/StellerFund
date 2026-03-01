#[cfg(test)]
mod test {
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
    }

    #[test]
    fn test_release_payment() {
        let env = Env::default();
        let contract_id = env.register_contract(None, EscrowContract);
        let client = EscrowContractClient::new(&env, &contract_id);

        let client_addr = Address::generate(&env);
        let freelancer_addr = Address::generate(&env);

        env.mock_all_auths();

        let escrow_id = client.create_escrow(&client_addr, &freelancer_addr, &1000);
        client.release_payment(&client_addr, &escrow_id);

        let escrow = client.get_escrow(&escrow_id);
        assert!(matches!(escrow.status, EscrowStatus::Completed));
    }
}
