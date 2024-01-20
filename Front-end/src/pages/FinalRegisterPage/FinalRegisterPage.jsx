import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as UserService from '../../service/UserService';
import { useMutation } from '@tanstack/react-query';
const FinalRegisterPage = () => {
	const { token } = useParams();
	const frontendHost = window.location.origin;
	const navigate = useNavigate();
	const mutation = useMutation({
		mutationFn: (token) => UserService.registerUser(token),
	});

	useEffect(() => {
		mutation.mutate({ token, frontendHost });
	}, [token]);

	const { data, isLoading } = mutation;
	useEffect(() => {
		if (data?.statusCode === 200 || data?.statusMessage === 'success') {
			Swal.fire('Congratulations !', data?.message, 'success').then(() => {
				navigate('/sign-in');
			});
		} else if (data?.statusMessage === 'failed') {
			Swal.fire('Oop!', data?.message, 'error').then(() => {
				navigate('/sign-up');
			});
		}
	}, [data?.statusCode]);
	return <div></div>;
};

export default FinalRegisterPage;
