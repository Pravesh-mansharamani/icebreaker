module icebreaker::escrow_pool {
    use sui::coin::{Self, Coin};
    use sui::object;
    use sui::object::UID;
    use sui::transfer;
    use sui::tx_context::TxContext;
    use sui::sui::SUI;

    /// Main pool struct that stores a single coin and password
    struct Pool has key, store {
        id: UID,
        coin: Coin<SUI>,
        password: vector<u8>,
    }

    /// Initialize a new pool with a password
    entry fun initialize_pool(in_coin: Coin<SUI>, password: vector<u8>, ctx: &mut TxContext) {
        let pool_obj = Pool {
            id: object::new(ctx),
            coin: in_coin,
            password,
        };
        
        transfer::public_share_object(pool_obj);
    }

    /// Entry function to deposit into the shared pool
    entry fun deposit_shared(pool: &mut Pool, new_coin: Coin<SUI>) {
        coin::join(&mut pool.coin, new_coin);
    }

    /// Entry function to withdraw from the shared pool and transfer to recipient
    entry fun withdraw_shared_and_transfer(
        pool: &mut Pool,
        amount: u64,
        recipient: address,
        password: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(pool.password == password, 0);
        
        // Split the coin
        let to_send = coin::split(&mut pool.coin, amount, ctx);
        
        transfer::public_transfer(to_send, recipient);
    }

    /// Get the current balance of the pool
    public fun get_balance(pool: &Pool): u64 {
        coin::value(&pool.coin)
    }
}
