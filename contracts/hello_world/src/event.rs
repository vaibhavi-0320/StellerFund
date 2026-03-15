use soroban_sdk::{symbol_short, Address, Env};

pub struct EscrowCreatedEvent {
    pub escrow_id: u64,
    pub client_address: Address,
    pub freelancer_address: Address,
    pub amount: i128,
}

pub struct EscrowReleasedEvent {
    pub escrow_id: u64,
    pub client_address: Address,
    pub freelancer_address: Address,
    pub amount: i128,
}

pub struct EscrowRefundedEvent {
    pub escrow_id: u64,
    pub client_address: Address,
    pub freelancer_address: Address,
    pub amount: i128,
}

impl EscrowCreatedEvent {
    pub fn publish(self, env: &Env) {
        env.events().publish(
            (symbol_short!("created"), self.escrow_id),
            (self.client_address, self.freelancer_address, self.amount),
        );
    }
}

impl EscrowReleasedEvent {
    pub fn publish(self, env: &Env) {
        env.events().publish(
            (symbol_short!("released"), self.escrow_id),
            (self.client_address, self.freelancer_address, self.amount),
        );
    }
}

impl EscrowRefundedEvent {
    pub fn publish(self, env: &Env) {
        env.events().publish(
            (symbol_short!("refunded"), self.escrow_id),
            (self.client_address, self.freelancer_address, self.amount),
        );
    }
}
