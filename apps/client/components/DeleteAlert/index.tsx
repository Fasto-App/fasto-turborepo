import { Center, Button, AlertDialog } from "native-base";
import React, { useCallback } from "react";

type DeleteAlertProps = {
	deleteItem: () => void;
	title: string;
	body: string;
	cancel: string;
}

export const DeleteAlert = (props: DeleteAlertProps) => {
	const { title, cancel, body, deleteItem } = props;
	const [isOpen, setIsOpen] = React.useState(false);

	const closeDeleteAlert = useCallback(() => {
		deleteItem();
		setIsOpen(false);
	}, [deleteItem])

	return (
		<Center>
			<Button w={"100%"} my={2} colorScheme="error" onPress={() => setIsOpen(!isOpen)}>
				{title}
			</Button>
			<Alert
				body={body}
				cancel={cancel}
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				onPress={closeDeleteAlert}
				title={title}
			/>
		</Center>
	)
}

type AlertProps = {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	body: string;
	cancel: string;
	onPress: () => void;
}

const Alert = (props: AlertProps) => {
	const { body, isOpen, onClose, title, cancel, onPress } = props
	const cancelRef = React.useRef(null);

	console.log(title)

	return (
		<AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
			<AlertDialog.Content>
				<AlertDialog.CloseButton />
				<AlertDialog.Header>{title}</AlertDialog.Header>
				<AlertDialog.Body>
					{body}
				</AlertDialog.Body>
				<AlertDialog.Footer>
					<Button.Group space={2} flex={1}>
						<Button variant="unstyled" colorScheme="coolGray" onPress={onClose} ref={cancelRef} flex={1}>
							{cancel}
						</Button>
						<Button colorScheme="error" onPress={onPress} flex={1}>
							{title}
						</Button>
					</Button.Group>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog>
	)
}