
import React, { useEffect, useState } from 'react';
import { useBreakpointValue } from 'native-base';
import { BusinessScreenContainer } from '../../components/atoms/BusinessScreenContainer';
import { BusinessNavigationTab } from './BusinessNavigationTab';
import { useRouter } from 'next/router';
import { BUSINESS_ADMIN, BusinessRouteKeys, businessPathName } from '../../routes';
import { analytics } from '../../firebase/init';
import { logEvent } from 'firebase/analytics';

const BusinessLayout = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter();

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

		analytics && logEvent(analytics, 'page_view', {
			app: 'business',
			page_title: businessPathName[router.pathname as BusinessRouteKeys] ?? router.pathname,
			page_path: router.pathname,
		});
	}, [router.pathname]);

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
