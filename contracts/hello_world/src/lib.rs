#![no_std]

mod error;
mod event;
mod storage;

#[cfg(test)]
mod test;

use error::ContractError;
use event::{EscrowCreatedEvent, EscrowRefundedEvent, EscrowReleasedEvent};
use soroban_sdk::{contract, contractimpl, token, Address, Env};
use stellar_fund_stf_token::StfTokenContractClient;
use storage::{
    bump_instance, bump_persistent, load_config, load_escrow, next_escrow_id, save_config,
    save_escrow, Config, DataKey, Escrow, Status,
};

#[contract]
pub struct StellarFundContract;

#[contractimpl]
impl StellarFundContract {
    // Initializes the contract with the STF token used for release rewards.
    pub fn initialize(
        env: Env,
        admin: Address,
        reward_token: Address,
        release_reward_amount: i128,
    ) -> Result<(), ContractError> {
        if release_reward_amount <= 0 {
            return Err(ContractError::InvalidAmount);
        }

        if load_config(&env).is_some() {
            return Err(ContractError::AlreadyInitialized);
        }

        admin.require_auth();

        let config = Config {
            admin,
            reward_token,
            release_reward_amount,
        };

        save_config(&env, &config);
        bump_instance(&env);
        Ok(())
    }

    pub fn create_escrow(
        env: Env,
        client: Address,
        freelancer: Address,
        token: Address,
        amount: i128,
    ) -> Result<u64, ContractError> {
        client.require_auth();

        if amount <= 0 || client == freelancer {
            return Err(ContractError::InvalidAmount);
        }

        let _config = load_config(&env).ok_or(ContractError::NotInitialized)?;
        let escrow_id = next_escrow_id(&env);
        let contract_address = env.current_contract_address();

        token::TokenClient::new(&env, &token)
            .try_transfer(&client, &contract_address, &amount)
            .map_err(|_| ContractError::TransferFailed)?
            .map_err(|_| ContractError::TransferFailed)?;

        let escrow = Escrow {
            id: escrow_id,
            client: client.clone(),
            freelancer: freelancer.clone(),
            token: token.clone(),
            amount,
            status: Status::Active,
        };

        save_escrow(&env, &escrow);

        EscrowCreatedEvent {
            escrow_id,
            client_address: client,
            freelancer_address: freelancer,
            amount,
        }
        .publish(&env);

        bump_instance(&env);
        bump_persistent(&env, &DataKey::NextEscrowId);
        bump_persistent(&env, &DataKey::Escrow(escrow_id));
        Ok(escrow_id)
    }

    pub fn release_payment(
        env: Env,
        escrow_id: u64,
        client: Address,
    ) -> Result<(), ContractError> {
        client.require_auth();

        let mut escrow = load_escrow(&env, escrow_id).ok_or(ContractError::EscrowNotFound)?;
        let config = load_config(&env).ok_or(ContractError::NotInitialized)?;

        if escrow.client != client {
            return Err(ContractError::Unauthorized);
        }

        if escrow.status != Status::Active {
            return Err(ContractError::AlreadyCompleted);
        }

        let contract_address = env.current_contract_address();
        token::TokenClient::new(&env, &escrow.token).transfer(
            &contract_address,
            &escrow.freelancer,
            &escrow.amount,
        );

        let reward_client = StfTokenContractClient::new(&env, &config.reward_token);
        reward_client
            .try_transfer(&contract_address, &escrow.freelancer, &config.release_reward_amount)
            .map_err(|_| ContractError::TransferFailed)?
            .map_err(|_| ContractError::TransferFailed)?;

        escrow.status = Status::Completed;
        save_escrow(&env, &escrow);

        EscrowReleasedEvent {
            escrow_id,
            client_address: escrow.client,
            freelancer_address: escrow.freelancer,
            amount: escrow.amount,
        }
        .publish(&env);

        bump_instance(&env);
        Ok(())
    }

    pub fn refund(env: Env, escrow_id: u64, client: Address) -> Result<(), ContractError> {
        client.require_auth();

        let mut escrow = load_escrow(&env, escrow_id).ok_or(ContractError::EscrowNotFound)?;
        let _config = load_config(&env).ok_or(ContractError::NotInitialized)?;

        if escrow.client != client {
            return Err(ContractError::Unauthorized);
        }

        if escrow.status != Status::Active {
            return Err(ContractError::AlreadyCompleted);
        }

        let contract_address = env.current_contract_address();
        token::TokenClient::new(&env, &escrow.token)
            .try_transfer(&contract_address, &escrow.client, &escrow.amount)
            .map_err(|_| ContractError::TransferFailed)?
            .map_err(|_| ContractError::TransferFailed)?;

        escrow.status = Status::Cancelled;
        save_escrow(&env, &escrow);

        EscrowRefundedEvent {
            escrow_id,
            client_address: escrow.client,
            freelancer_address: escrow.freelancer,
            amount: escrow.amount,
        }
        .publish(&env);

        bump_instance(&env);
        Ok(())
    }

    pub fn get_escrow(env: Env, escrow_id: u64) -> Result<Escrow, ContractError> {
        let escrow = load_escrow(&env, escrow_id).ok_or(ContractError::EscrowNotFound)?;
        bump_instance(&env);
        Ok(escrow)
    }

    pub fn get_next_escrow_id(env: Env) -> u64 {
        bump_instance(&env);
        next_escrow_id(&env)
    }

    pub fn get_config(env: Env) -> Result<Config, ContractError> {
        let config = load_config(&env).ok_or(ContractError::NotInitialized)?;
        bump_instance(&env);
        Ok(config)
    }
}
