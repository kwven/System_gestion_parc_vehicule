-- Table d'audit universelle 
CREATE TABLE audit_log ( 
    id SERIAL PRIMARY KEY, 
    schema_name VARCHAR(50) NOT NULL, 
    table_name VARCHAR(50) NOT NULL, 
    operation VARCHAR(10) NOT NULL, 
    user_name VARCHAR(100) NOT NULL, 
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    old_values JSONB, 
    new_values JSONB, 
    ip_address INET 
); 
  
-- Trigger d'audit générique 
CREATE OR REPLACE FUNCTION audit_trigger_function() 
RETURNS TRIGGER AS $$ 
BEGIN 
    INSERT INTO audit_log ( 
        schema_name, table_name, operation, user_name, 
        old_values, new_values, ip_address 
    ) VALUES ( 
        TG_TABLE_SCHEMA, TG_TABLE_NAME, TG_OP, current_user, 
        CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END, 
        CASE WHEN TG_OP = 'INSERT' THEN row_to_json(NEW) 
             WHEN TG_OP = 'UPDATE' THEN row_to_json(NEW) ELSE NULL END, 
        inet_client_addr() 
    ); 
    RETURN COALESCE(NEW, OLD); 
END; 
$$ LANGUAGE plpgsql;