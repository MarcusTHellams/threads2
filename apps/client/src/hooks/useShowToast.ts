import { useToast } from "@chakra-ui/toast";
import {  AlertStatus } from '@chakra-ui/alert';

import { useCallback } from "react";

export const useShowToast = () => {
	const toast = useToast();

	const showToast = useCallback(
		(title: string, description: string, status: AlertStatus) => {
			toast({
				title,
				description,
				status,
				duration: 3000,
				isClosable: true,
			});
		},
		[toast]
	);

	return showToast;
};

