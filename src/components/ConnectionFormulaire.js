
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/connection.css';

function ConnectionFormulaire() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const navigate = useNavigate();

    return (
        <Form id='LoadingHome'>
            <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Identifiant</Form.Label>
                <Form.Control type="text" placeholder="Renseignez votre identifiant" value={username} onChange={handleUsernameChange} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control type="password" placeholder="Renseignez votre mot de passe" value={password} onChange={handlePasswordChange} />
                <Form.Text className="text-muted">
                    Rappel : Nous ne vous demanderons jamais votre mot de passe.
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Se souvenir de moi" />
            </Form.Group>

            <Button className="buttonConnected" type="submit" onClick={(event) => {
                event.preventDefault();
                axios.post(
                    'http://localhost:3000/users/loginU',
                    JSON.stringify({ 'identifiant': username, 'password': password }),
                    {
                        headers: { "Content-Type": "application/json" },
                    }
                )
                    .then(response => {
                        localStorage.setItem("token", response.data.token);
                        localStorage.setItem("username", username);
                        navigate("/scount");
                    })
                    .catch(error => {
                        console.log(error.message);
                    });
            }}>
                Se connecter
            </Button>
        </Form>
    );
}

export default ConnectionFormulaire;
