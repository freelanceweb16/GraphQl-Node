const app = require('express')();
const {graphqlHTTP} = require('express-graphql');
const {buildSchema} = require('graphql');
const fs = require('fs');
const http = require('http');
const { countReset } = require('console');
const port = process.env.PORT || 8000;

// GraphQl Schema
const schema = buildSchema(`
    type Query {
        book(id: Int!): Book
        books(topic: String): [Book]
    }

    type Mutation{
        updateBookTopic(id: Int!, topic: String!): Book
    }

    type Book {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    }
`);

var bookData = [
    {
        id: 1,
        title:'NodeJs and Express',
        author:'Michel',
        description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec at sapien eu massa sollicitudin blandit eu quis enim.',
        topic: 'Node.js',
        url: 'https://www.google.com'
    },
    {
        id: 2,
        title:'Become a Php developper',
        author:'Gabriel',
        description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec at sapien eu massa sollicitudin blandit eu quis enim.',
        topic: 'Php',
        url: 'https://www.google.com'
    },
    {
        id: 3,
        title:'Learn the concept of json application',
        author:'Anabelle',
        description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec at sapien eu massa sollicitudin blandit eu quis enim.',
        topic: 'Json',
        url: 'https://www.google.com'
    },
];

const getBook = function(args){
    const id = args.id;
    return bookData.filter(book => {
        return book.id == id;
    })[0];
};

const getBooks = function(args){
    if(args.topic){
        var topic = args.topic;
        return bookData.filter(book => book.topic == topic);
    }else{
        return bookData;
    }
};

const updateBookTopic = function({id, topic}){
    bookData.map(book =>{
        if(book.id === id){
            book.topic = topic;
            return book;
        }
    });
    return bookData.filter(book => book.id === id)[0];
}

// Root resolver
const root = {
    book:getBook,
    books:getBooks,
    updateBookTopic: updateBookTopic
}

// Create an express server and a GraphQl endpoint
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.listen(port, () => {
    console.log('Server app Express/GraphQl listening on port ' + port);
});