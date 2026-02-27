#![no_std]
use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, token, Address, Env, Symbol,
};

const COUNTER: Symbol = Symbol::new(&[67, 79, 85, 78, 84, 69, 82]); // "COUNTER"

#[derive(Clone)]
#[contracttype]
pub struct Escrow {
    pub id: u64,
    pub client: Address,
    pub freelancer: Address,
    pub amount: i128,
    pub released: bool,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    EscrowNotFound = 1,
    NotAuthorized = 2,
    AlreadyReleased = 3,
    InvalidAmount = 4,
}

#[contract]
pub struct EscrowContract;

#[contractimpl]
impl EscrowContract {
    pub fn create_escrow(
        env: Env,
        client: Address,
        freelancer: Address,
        amount: i128,
    ) -> Result<u64, Error> {
        client.require_auth();

        if amount <= 0 {
            return Err(Error::InvalidAmount);
        }

        let mut counter: u64 = env.storage().instance().get(&COUNTER).unwrap_or(0);
        counter += 1;

        let escrow = Escrow {
            id: counter,
            client: client.clone(),
            freelancer: freelancer.clone(),
            amount,
            released: false,
        };

        env.storage().instance().set(&counter, &escrow);
        env.storage().instance().set(&COUNTER, &counter);

        Ok(counter)
    }

    pub fn release_escrow(env: Env, client: Address, id: u64) -> Result<(), Error> {
        client.require_auth();

        let mut escrow: Escrow = env
            .storage()
            .instance()
            .get(&id)
            .ok_or(Error::EscrowNotFound)?;

        if escrow.client != client {
            return Err(Error::NotAuthorized);
        }

        if escrow.released {
            return Err(Error::AlreadyReleased);
        }

        escrow.released = true;
        env.storage().instance().set(&id, &escrow);

        Ok(())
    }

    pub fn refund_escrow(env: Env, client: Address, id: u64) -> Result<(), Error> {
        client.require_auth();

        let mut escrow: Escrow = env
            .storage()
            .instance()
            .get(&id)
            .ok_or(Error::EscrowNotFound)?;

        if escrow.client != client {
            return Err(Error::NotAuthorized);
        }

        if escrow.released {
            return Err(Error::AlreadyReleased);
        }

        escrow.released = true;
        env.storage().instance().set(&id, &escrow);

        Ok(())
    }

    pub fn get_escrow(env: Env, id: u64) -> Result<Escrow, Error> {
        env.storage()
            .instance()
            .get(&id)
            .ok_or(Error::EscrowNotFound)
    }

    pub fn get_counter(env: Env) -> u64 {
        env.storage().instance().get(&COUNTER).unwrap_or(0)
    }
}

#[cfg(test)]
mod test;
