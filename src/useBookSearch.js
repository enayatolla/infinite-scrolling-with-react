import axios from "axios";
import React, { useEffect, useState } from "react";

export default function useBookSearch(query, pageNumber) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [books, setBooks] = useState([]);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        setBooks([]);
    }, [query]);

    useEffect(() => {
        setLoading(true);
        setError(false);
        let cancel;
        axios(
            {
                method: "GET",
                url: "http://openlibrary.org/search.json",
                params: { q: query, page: pageNumber },
                cancelToken: new axios.CancelToken((c) => (cancel = c)),
            },
            [query, pageNumber]
        )
            .then((response) => {
                setBooks((prevBooks) => {
                    return [
                        ...new Set([
                            ...prevBooks,
                            ...response.data.docs.map((b) => b.title),
                        ]),
                    ];
                });
                setLoading(false);
                setHasMore(response.data.docs.length > 0);
            })
            .catch((e) => {
                if (axios.isCancel(e)) return;
                setError(true);
            });
        return () => cancel();
    }, [query, pageNumber]);
    return { books, error, hasMore, loading };
}
