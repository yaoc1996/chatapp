import FriendServices from "./FriendServices";
import AccessControl from "./AccessControl";
import Authenticator from "./Authenticator";
import GetUser from "./GetUser";
import SocketServices from "./SocketServices";
import GetConversations from "./GetConversations";
import UIServices from "./UIServices";

function Services() {
	return (
		<>
			<AccessControl />
			<Authenticator />
			<FriendServices />
			<GetConversations />
			<GetUser />
			<SocketServices />
			<UIServices />
		</>
	);
}

export default Services;
