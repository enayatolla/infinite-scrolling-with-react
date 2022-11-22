import React, { useCallback, useRef, useState } from "react";
import "./App.css";
import useBookSearch from "./useBookSearch";

const App = () => {
    const [query, setQuery] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const { books, error, hasMore, loading } = useBookSearch(query, pageNumber);
    const observer = useRef();

    const lastBookElementRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPageNumber((prevPageNumber) => prevPageNumber + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );
    function handleSearch(e) {
        setQuery(e.target.value);
        setPageNumber(1);
    }

    console.log(loading);
    return (
        <>
            <input onChange={handleSearch} value={query} type="text" />
            {books.map((book, index) => {
                if (books.length === index + 1) {
                    return (
                        <div ref={lastBookElementRef} key={index}>
                            <span>{index + 1} : </span>
                            {book}
                        </div>
                    );
                } else {
                    return (
                        <div key={index}>
                            <span>{index + 1} : </span>
                            {book}
                        </div>
                    );
                }
            })}
            <div>{loading && "Loading..."}</div>
            <div>{error && "Error"}</div>
        </>
    );
};

export default App;
