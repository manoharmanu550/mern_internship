import { useState } from "react";
import API from "../services/api";
import PostCard from "../components/PostCard";
import "../styles/Search.css";

function Search(){

    const [keyword,setKeyword]=useState("");
    const [posts,setPosts]=useState([]);

    const handleSearch=async()=>{

        try{

           const res = await API.get(`/posts/search?keyword=${keyword}`);

            setPosts(res.data.posts);

        }catch(err){

            console.log(err);

        }

    }

    return(

        <div className="search-page">

            <div className="search-header">

                <span className="search-icon">🔍</span>

                <h1>Search Posts</h1>

            </div>

            <div className="search-box">

                <input
                    type="text"
                    placeholder="Search by title or content..."
                    value={keyword}
                    onChange={(e)=>setKeyword(e.target.value)}
                />

                <button onClick={handleSearch}>
                    Search
                </button>

            </div>

            <h2 className="total-results">
                Total Results : {posts.length}
            </h2>

            <div className="search-results">

                {
                    posts.length>0 ?

                    posts.map(post=>(
                        <PostCard
                            key={post._id}
                            post={post}
                        />
                    ))

                    :

                    <h2 className="no-posts">
                        No Posts Found
                    </h2>

                }

            </div>

        </div>

    )

}

export default Search;