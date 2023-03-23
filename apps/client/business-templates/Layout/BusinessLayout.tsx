
import React, { useEffect, useState } from 'react';
import { Box, useBreakpointValue } from 'native-base';
import { StyleSheet } from 'react-native';
import { BusinessScreenContainer } from '../../components/atoms/BusinessScreenContainer';
import { colors } from '../../theme/colors';
import { BusinessNavigationTab } from './BusinessNavigationTab';
import { AppBar } from '../../components/AppBar/AppBar';
import router from 'next/router';
import { BUSINESS_ADMIN } from '../../routes';

const BusinessLayout = ({ children }: { children: React.ReactNode }) => {
	const [hasMounted, setHasMounted] = useState(false);
	const display = useBreakpointValue({
		base: false,
		md: true,
	});

	const isAdminRoute = router.pathname.includes(BUSINESS_ADMIN)
	const shouldShowSideBar = display && isAdminRoute &&
		!router.pathname.includes("add-to-order") &&
		!router.pathname.includes("checkout")

	useEffect(() => {
		setHasMounted(true);
	}, []);

	if (!hasMounted) {
		return null;
	}

	return (
		<BusinessScreenContainer>
			{shouldShowSideBar ? <BusinessNavigationTab /> : null}
			{children}
		</BusinessScreenContainer>
	);
};

export { BusinessLayout };
