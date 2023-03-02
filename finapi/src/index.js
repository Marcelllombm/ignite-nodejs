const express = require('express');
const {v4: uuidv4} = require('uuid');

const app = express();
app.use(express.json());


//amazenamento de  dados
const customers = [];

//Middleware
function verifyInfExistsAccountCPF (request, response, next) {
    const {cpf} = request.headers;
    
    const customer = customers.find((customers) => customers.cpf === cpf);
    
    if(!customer){
        return response.status(404).json({error: "customer not found"});
    }
    
    request.customer = customer;
    
    return next();
    
}

function getBalance(statement){
    console.log(statement.amount);
    
    const balance = statement.reduce((acc, operation) => {
        if(operation.type === 'credit'){
            return acc + operation.amount;
        } else {
            return acc - operation.amount ;
        }
    }, 0 );
   
    return balance;
}

app.post ('/account',(request, response) =>{
    const {cpf , name} = request.body;
    
    const customersAlreadyExist = customers.some((customer) => customer.cpf === cpf);
    
    if(customersAlreadyExist) {
        return response.status(400).json({error: "Customer already exists!"})
        } 
    
    customers.push({
        cpf,
        name,
        id: uuidv4(), 
        statement: []
    });
   
    return response.status(201).send();
})

// app.use(verifyInfExistsAccountCPF);

app.get('/statement', verifyInfExistsAccountCPF, (request, response) => {
    
    const customer = request.customer;    
    return response.status(200).json(customer.statement); 
})

app.post('/deposit',verifyInfExistsAccountCPF, (request, response) => {
    const {description, amount} = request.body;
    const {customer} = request;
    
    const statementOperations = {
        description,
        amount,
        create_at: new Date(),
        type:"credit"
    }
    
    customer.statement.push(statementOperations);
    
    return response.status(201).send();
})

app.post('/withdraw',verifyInfExistsAccountCPF, (request, response)=>{
const {amount} = request.body;
const {customer} = request;
const balance = getBalance(customer.statement);


if(balance < amount) {
return response.status(400).json({error: "Insufficient funds!"});
}

const statementOperations = {
    amount,
    create_at: new Date(),
    type:"debit"
}

customer.statement.push(statementOperations);

return response.status(201).send();
})


app.listen(3333);
