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
    console.log(customer);
    
    return response.status(200).json(customer);
    
    
})
app.listen(3333);
