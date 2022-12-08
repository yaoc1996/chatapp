import { useEffect, useState } from "react";
import { searchUsers } from "src/api";

function useSearchUsers(searchString) {
	const [searchResults, setSearchResults] = useState([]);
	const [isSearching, setIsSearching] = useState(false);

	useEffect(() => {
		if (!searchString) {
			setSearchResults([]);
			setIsSearching(false);
		} else {
			setIsSearching(true);

			const timeoutId = setTimeout(() => {
				searchUsers(searchString).then((results) => {
					setSearchResults(results);
					setIsSearching(false);
				});
			}, 500);

			return () => {
				clearTimeout(timeoutId);
			};
		}
	}, [searchString]);

	return [searchResults, isSearching];
}

export default useSearchUsers;
