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
	const onClose = () => setIsOpen(false);
	const cancelRef = React.useRef(null);

	const closeDeleteAlert = useCallback(() => {
		deleteItem();
		setIsOpen(false);
	}, [deleteItem])

	return (
		<Center>
			<Button w={"100%"} my={2} colorScheme="error" onPress={() => setIsOpen(!isOpen)}>
				{title}
			</Button>
			<AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
				<AlertDialog.Content>
					<AlertDialog.CloseButton />
					<AlertDialog.Header>{title}</AlertDialog.Header>
					<AlertDialog.Body>
						{body}
					</AlertDialog.Body>
					<AlertDialog.Footer>
						<Button.Group space={2}>
							<Button variant="unstyled" colorScheme="coolGray" onPress={onClose} ref={cancelRef}>
								{cancel}
							</Button>
							<Button colorScheme="error" onPress={closeDeleteAlert}>
								{title}
							</Button>
						</Button.Group>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog>
		</Center>
	)
}