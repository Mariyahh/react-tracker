import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { Box, Heading, Input, Button, Text, Link } from '@chakra-ui/react';

const RegistrationForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://localhost:7199/api/User/Register', {
                username,
                email,
                password
            });
            console.log('Registration successful:', response.data);
            setSuccess(true);
            setError('');
        } catch (error) {
            console.error('Registration failed:', error.response.data);
            setError(error.response.data.message);
            setSuccess(false);
        }
    };

    return (
        <Box maxW="400px" m="auto" mt="8" p="15px">
            <Heading as="h2" mb="4" textAlign="center">Register</Heading>
            {error && <Text color="red.500" mb="4">{error}</Text>}
            {success && <Text color="green.500" mb="4">Registration successful!</Text>}
            <form onSubmit={handleSubmit}>
                <Box mb="4">
                    <label>Username:</label>
                    <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required bg="white" />
                </Box>
                <Box mb="4">
                    <label>Email:</label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required bg="white" />
                </Box>
                <Box mb="4">
                    <label>Password:</label>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required bg="white" />
                </Box>
                <Button type="submit" colorScheme="blue" mb="4" width="100%">Register</Button>
            </form>
            <Text textAlign="center">
                Already have an account? <Link as={RouterLink} to="/login" color="blue.500">Login here</Link>.
            </Text>
        </Box>
    );
};

export default RegistrationForm;
