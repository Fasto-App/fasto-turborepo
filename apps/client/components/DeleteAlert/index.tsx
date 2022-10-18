import { Center, Button, AlertDialog } from "native-base";
import React from "react";


const alertText = {
	title: "Delete Product",
	body: "This will remove all data relating to this product. This action cannot be reversed.",
	delete: "Delete",
	cancel: "Cancel",
}

export const DeleteAlert = ({ title, deleteItem }) => {
	const [isOpen, setIsOpen] = React.useState(false);
	const onClose = () => setIsOpen(false);
	const cancelRef = React.useRef(null);

	const closeDeleteAlert = () => {
		deleteItem();
		setIsOpen(false);
	}

	return (

		<Center>
			<Button w={"100%"} my={2} colorScheme="error" onPress={() => setIsOpen(!isOpen)}>
				{title}
			</Button>
			<AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
				<AlertDialog.Content>
					<AlertDialog.CloseButton />
					<AlertDialog.Header>{alertText.title}</AlertDialog.Header>
					<AlertDialog.Body>
						{alertText.body}
					</AlertDialog.Body>
					<AlertDialog.Footer>
						<Button.Group space={2}>
							<Button variant="unstyled" colorScheme="coolGray" onPress={onClose} ref={cancelRef}>
								{alertText.cancel}
							</Button>
							<Button colorScheme="error" onPress={closeDeleteAlert}>
								{alertText.delete}
							</Button>
						</Button.Group>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog>
		</Center>
	)
}