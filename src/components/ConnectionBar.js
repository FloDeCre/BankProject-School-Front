// CETTE PAGE EST UN EXEMPLE DE PAGE UTILISATEUR

import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import '../App.css';
import { useNavigate } from 'react-router-dom';


function ConnectionBar() {

  
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const tokenUser = localStorage.getItem('token');  
  const navigate = useNavigate();  

  
  useEffect(() => {
    axios.get('http://localhost:3000/users/all', { headers: { "Content-Type": "application/json", "Authorization": tokenUser } })
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.log(error);
        navigate("/");  
      });
  }, []);


  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCommand, setSelectedCommand] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const username = localStorage.getItem("username");  
  const [showUserModal, setShowUserModal] = useState(false);
  const filteredUsers = users.filter(user => user.username === username);


  const handleVoirUserClick = (id) => {
    axios.get(`http://localhost:3000/users/one/${id}`)
      .then(response => {
        setSelectedUser(response.data);
        setShowUserModal(true);
      })
      .catch(error => {
        console.log(error);
      });
  };

  
  const handleCloseUserModal = () => {
    setShowUserModal(false);
  };

 
  const handleVoirClick = (id) => {
    axios.get(`http://localhost:3000/commands/one/${id}`)
      .then(response => {
        setSelectedCommand(response.data);
        setShowModal(true);
      })
      .catch(error => {
        console.log(error);
      });
  };

  
  const handleSupprimerClick = (id) => {
    axios.delete(`http://localhost:3000/commands/delete/${id}`)
      .then(response => {
        console.log(response.data);
        setFilteredData(filteredData.filter(command => command.id !== id));
      })
      .catch(error => {
        console.log(error);
      });
  };

  
  useEffect(() => {
    axios.get('http://localhost:3000/commands/all', { headers: { "Content-Type": "application/json", "Authorization": tokenUser } })
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  
  useEffect(() => {
    const filteredCommands = data.filter(command => command.username === username);
    setFilteredData(filteredCommands);
  }, [data, username]);

  
  const handleCloseModal = () => {
    setShowModal(false);
  };

  
  const handleModifierClick = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  
  const handleInputChange = (field, value) => {
    
    setEditingUser((prevUser) => ({
      
      ...prevUser,

      [field]: value,
    }));
  };


  const handleEnvoyerClick = () => {
    axios.put(`http://localhost:3000/users/update/${editingUser.id}`, editingUser)
      .then(response => {
        setUsers((prevUsers) => prevUsers.map((user) => (user.id === editingUser.id ? editingUser : user)));
        setEditingUser(null);
        setShowModal(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleFermerClick = () => {
    setEditingUser(null);
    setShowModal(false);
  };

  return (
    <section>
      <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">Compte Client</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              Connecté: <a href="#login">{username}</a>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div>
        <h2>Votre compte</h2>
        <div>
          {filteredUsers.map((user, index) => (
            <Card className='HomeCard2' key={index} style={{ width: '18rem' }}>
              <Card.Body>
                <Card.Title>{user.username}</Card.Title>
                <Card.Text>
                  Nom: {user.nom}, Prénom: {user.prenom}
                </Card.Text>
                <Button variant="primary" onClick={() => handleVoirUserClick(user.id)}>Voir</Button>
                <Button variant="primary" onClick={() => handleModifierClick(user)}>Modifier</Button>
              </Card.Body>
            </Card>
          ))}
          {selectedUser && (
            <Modal show={showUserModal} onHide={handleCloseUserModal}>
              <Modal.Header closeButton>
                <Modal.Title>Utilisateur</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>Nom: {selectedUser[0].nom}</ListGroup.Item>
                  <ListGroup.Item>Prénom: {selectedUser[0].prenom}</ListGroup.Item>
                  <ListGroup.Item>Adresse: {selectedUser[0].adresse}</ListGroup.Item>
                </ListGroup>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseUserModal}>
                  Fermer
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </div>
      </div>
      <div>
        <h2>Vos Commandes</h2>
        {filteredData.map((element, index) => (
          <Card className='HomeCard2' key={index} style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>{element.date}</Card.Title>
              <Card.Text>
                Date: {element.date}, Produit: {element.produit}, Utilisateur: {element.username}
              </Card.Text>
              <Button variant="primary" onClick={() => handleVoirClick(element.id)}>Voir</Button>
              <Button variant="danger" onClick={() => handleSupprimerClick(element.id)}>Supprimer</Button>
            </Card.Body>
          </Card>
        ))}
        {selectedCommand && (
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Commandes</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedCommand.map((command, index) => (
                <div key={index}>
                  <ListGroup variant="flush">
                    <ListGroup.Item>Produit: {command.produit}</ListGroup.Item>
                    <ListGroup.Item>Montant HT: {command.montant_ht}</ListGroup.Item>
                    <ListGroup.Item>TVA: {command.tva}</ListGroup.Item>
                    <ListGroup.Item>Montant TTC: {command.montant_ttc}</ListGroup.Item>
                    <ListGroup.Item>Utilisateur: {command.username}</ListGroup.Item>
                    <ListGroup.Item>Nom: {command.nom}</ListGroup.Item>
                    <ListGroup.Item>Prénom: {command.prenom}</ListGroup.Item>
                    <ListGroup.Item>Adresse: {command.adresse}</ListGroup.Item>
                  </ListGroup>
                  <hr />
                </div>
              ))}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Fermer
              </Button>
            </Modal.Footer>
          </Modal>
        )}
        {editingUser && (
          <Modal show={showModal} onHide={handleFermerClick}>
            <Modal.Header closeButton>
              <Modal.Title>Modifier Utilisateur</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" value={editingUser.username} onChange={(e) => handleInputChange('username', e.target.value)} />
                </Form.Group>
                <Form.Group controlId="formMail">
                  <Form.Label>Mail</Form.Label>
                  <Form.Control type="text" value={editingUser.mail} onChange={(e) => handleInputChange('mail', e.target.value)} />
                </Form.Group>
                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" value={editingUser.password} onChange={(e) => handleInputChange('password', e.target.value)} />
                </Form.Group>
                <Form.Group controlId="formNom">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control type="text" value={editingUser.nom} onChange={(e) => handleInputChange('nom', e.target.value)} />
                </Form.Group>
                <Form.Group controlId="formPrenom">
                  <Form.Label>Prénom</Form.Label>
                  <Form.Control type="text" value={editingUser.prenom} onChange={(e) => handleInputChange('prenom', e.target.value)} />
                </Form.Group>
                <Form.Group controlId="formAdresse">
                  <Form.Label>Adresse</Form.Label>
                  <Form.Control type="text" value={editingUser.adresse} onChange={(e) => handleInputChange('adresse', e.target.value)} />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleEnvoyerClick}>
                Envoyer
              </Button>
              <Button variant="secondary" onClick={handleFermerClick}>
                Fermer
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </section>
  );
}

export default ConnectionBar;
