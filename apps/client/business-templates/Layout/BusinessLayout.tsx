
import React, { useEffect, useState } from 'react';
import { Box, useBreakpointValue } from 'native-base';
import { View, StyleSheet } from 'react-native';
import { BusinessScreenContainer } from '../../components/atoms/BusinessScreenContainer';
import { colors } from '../../theme/colors';
import { BusinessNavigationTab } from './BusinessNavigationTab';
import { AppBar } from '../../components/AppBar/AppBar';
import router from 'next/router';
import { BUSINESS_ADMIN } from '../../routes';

const styles = StyleSheet.create({
	leftContainer: {
		// flex: 1,
		height: '100vh',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.blueboard,
	},
	rightContainer: {
		flex: 1,
		width: "100%",
		backgroundColor: colors.whiteboard,
		overflow: 'scroll',
	},
});

const BusinessLayout = ({ children }: { children: React.ReactNode }) => {
	const [hasMounted, setHasMounted] = useState(false);

	const isAdminRoute = router.pathname.includes(BUSINESS_ADMIN)

	const display = useBreakpointValue({
		base: false,
		md: true,
	});

	useEffect(() => {
		setHasMounted(true);
	}, []);

	if (!hasMounted) {
		return null;
	}

	// if (!isAdminRoute) return null;
	return (
		<BusinessScreenContainer>
			{display && isAdminRoute && !router.pathname.includes("add-to-order") ? <BusinessNavigationTab /> : null}
			<View style={styles.rightContainer}>
				{isAdminRoute && <Box backgroundColor={"primary.500"} h={150} w={"100%"} position={"absolute"}>
					<AppBar />
				</Box>}
				{children}
			</View>
		</BusinessScreenContainer>
	);
};

export { BusinessLayout };
