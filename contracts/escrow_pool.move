module icebreaker::escrow_pool {
    use sui::coin::{Coin, Self};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::sui::SUI;

    /// Main pool struct that stores the balance and password
    struct Pool has key {
        balance: Coin<SUI>,
        password: vector<u8>,
    }

    /// Initialize a new pool with a password
    public fun create_pool(password: vector<u8>, ctx: &mut TxContext): Pool {
        let coin = coin::zero<SUI>();
        Pool { balance: coin, password }
    }

    /// Deposit SUI into the pool
    public fun deposit(pool: &mut Pool, coin: Coin<SUI>) {
        coin::merge(&mut pool.balance, coin);
    }

    /// Withdraw SUI from the pool (requires correct password)
    public fun withdraw(pool: &mut Pool, amount: u64, password: vector<u8>, ctx: &mut TxContext): Coin<SUI> {
        assert!(pool.password == password, 0);
        coin::split(&mut pool.balance, amount)
    }

    /// Entry function to initialize the pool and share it
    public entry fun initialize_pool(initial_balance: Coin<SUI>, password: vector<u8>, ctx: &mut TxContext) {
        let pool = create_pool(password, ctx);
        deposit(&mut pool, initial_balance);
        transfer::share_object(pool);
    }

    /// Entry function to deposit into the shared pool
    public entry fun deposit_shared(pool: &mut Pool, coin: Coin<SUI>) {
        deposit(pool, coin);
    }

    /// Entry function to withdraw from the shared pool
    /// Note: This returns a Coin that needs to be handled by the caller
    entry fun withdraw_shared_and_transfer(pool: &mut Pool, amount: u64, recipient: address, password: vector<u8>, ctx: &mut TxContext) {
        assert!(pool.password == password, 0);
        let coin = coin::split(&mut pool.balance, amount);
        transfer::public_transfer(coin, recipient);
    }

    /// Get the current balance of the pool
    public fun get_balance(pool: &Pool): u64 {
        coin::value(&pool.balance)
    }
}
