const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Configuração do CORS para permitir que o React (porta 5173) acesse o servidor Node.js
app.use(cors({ origin: 'http://localhost:5173' }));

// Configuração do Body Parser
app.use(bodyParser.json());

// Configuração da Conexão com o MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Coloque seu usuário do MySQL aqui
    password: '',  // Coloque sua senha do MySQL aqui
    database: 'site_fotografia'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL');
});

// Rotas CRUD
// Rota para criar um novo contato
app.post('/api/contatos', (req, res) => {
    const { nome, email, telefone, data, local, mensagem } = req.body;
    const sql = 'INSERT INTO contatos (nome, email, telefone, data, local, mensagem) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [nome, email, telefone, data, local, mensagem], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Contato adicionado com sucesso!' });
    });
});

// Rota para listar todos os contatos
app.get('/api/contatos', (req, res) => {
    const sql = 'SELECT * FROM contatos';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// Rota para atualizar um contato
app.put('/api/contatos/:id', (req, res) => {
    const { id } = req.params;
    const { nome, email, telefone, data, local, mensagem } = req.body;
    const sql = 'UPDATE contatos SET nome = ?, email = ?, telefone = ?, data = ?, local = ?, mensagem = ? WHERE id = ?';
    db.query(sql, [nome, email, telefone, data, local, mensagem, id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Contato atualizado com sucesso!' });
    });
});

// Rota para deletar um contato
app.delete('/api/contatos/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM contatos WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Contato deletado com sucesso!' });
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
