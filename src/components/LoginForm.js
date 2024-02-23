import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../AuthContext';
import { Box, Heading, Input, Button, Text, Link } from '@chakra-ui/react';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const auth = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('https://localhost:7199/api/User/Login', { email, password });
            const { token } = response.data;
            localStorage.setItem('token', token);
            auth.login(token);

            toast.success(`Welcome back!`, { position: 'top-center' });

            navigate('/');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('Invalid email or password');
                // toast.error('Wrong email or password', { position: 'top-center' });
            } else {
                alert('An error occurred while logging in'); 
            }
        }
    };

    const handleSubmit = (e) => {
        handleLogin(e); 
    };

    return (
        <Box maxW="400px" m="auto" mt="8" p="15px">
            <Heading as="h2" mb="4" textAlign="center">Login</Heading>
            <form onSubmit={handleSubmit}>
                <Box mb="4">
                    <label htmlFor="email">Email:</label>
                    <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required bg="white" />
                </Box>
                <Box mb="4">
                    <label htmlFor="password">Password:</label>
                    <Input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required bg="white" />
                </Box>
                <Button type="submit" colorScheme="blue" mb="4" width="100%">Login</Button>
            </form>
            <Text textAlign="center">
                Don't have an account? <Link as={RouterLink} to="/register" color="blue.500">Register here</Link>.
            </Text>
        </Box>
    );
};

export default LoginForm;