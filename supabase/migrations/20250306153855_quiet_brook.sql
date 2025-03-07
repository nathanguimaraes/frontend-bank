/*
  # Banking System Schema

  1. New Tables
    - `accounts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `balance` (numeric)
      - `is_blocked` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `transactions`
      - `id` (uuid, primary key)
      - `account_id` (uuid, references accounts)
      - `type` (text: 'deposit', 'withdrawal')
      - `amount` (numeric)
      - `description` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to:
      - Read their own account and transactions
      - Create transactions
      - Update their account (for blocking)
*/

-- Create accounts table
CREATE TABLE accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  balance numeric DEFAULT 0 CHECK (balance >= 0),
  is_blocked boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create transactions table
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES accounts NOT NULL,
  type text NOT NULL CHECK (type IN ('deposit', 'withdrawal')),
  amount numeric NOT NULL CHECK (amount > 0),
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Accounts policies
CREATE POLICY "Users can view own account"
  ON accounts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own account"
  ON accounts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM accounts
      WHERE accounts.id = transactions.account_id
      AND accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM accounts
      WHERE accounts.id = account_id
      AND accounts.user_id = auth.uid()
      AND NOT accounts.is_blocked
    )
  );

-- Function to update account balance
CREATE OR REPLACE FUNCTION update_account_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'deposit' THEN
    UPDATE accounts 
    SET balance = balance + NEW.amount,
        updated_at = now()
    WHERE id = NEW.account_id;
  ELSIF NEW.type = 'withdrawal' THEN
    UPDATE accounts 
    SET balance = balance - NEW.amount,
        updated_at = now()
    WHERE id = NEW.account_id
    AND balance >= NEW.amount;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating balance
CREATE TRIGGER update_balance_on_transaction
AFTER INSERT ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_account_balance();