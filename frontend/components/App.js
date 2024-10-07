import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate('/')}
  const redirectToArticles = () => { navigate('/articles') }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    localStorage.removeItem('token')
    redirectToLogin()
    setMessage("Goodbye!")
    
  }

  const login = async ({ username, password }) => {
    setMessage('')        
    setSpinnerOn(true)        
  
    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),  
      });
      
      const data = await response.json();
      
      if (response.ok) {   
        localStorage.setItem('token', data.token); 
        setMessage((data.message || `Here are your articles, ${username}!`));        
        setCurrentArticleId(null)
        redirectToArticles();                       

     
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');  
    } finally {
      setSpinnerOn(false);   
    }
      
    
  };


  const getArticles = async () => {
    // ✨ implement
    setMessage("");
    setSpinnerOn(true);



    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(articlesUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      setArticles(response.data.articles);
      setMessage(response.data.message);
    } catch (error) {
      if (error?.response.status == 401) redirectToLogin();
    } finally {
      setSpinnerOn(false);
    }
  };
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
  

  const postArticle = async ({ title, text, topic}) => {
    setMessage("");
    setSpinnerOn(true);



    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        articlesUrl, 
        { title, text, topic },
         {
        headers: {
          "Content-Type": "application/json",
         Authorization: token,
        },
      });
      setArticles(prevArticles => [...prevArticles, response.data.article]);
      setMessage(response.data.message);
    } 
    
    catch (error) {
      if (error?.response.status == 401) 
        redirectToLogin();
    } finally {
      setSpinnerOn(false);
    }
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
  }

  const updateArticle = async (article_id, article ) => {
    setMessage("");
    setSpinnerOn(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${articlesUrl}/${article_id}`,
        {
          title: article.title,
          text: article.text,
          topic: article.topic,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
     
      await getArticles();
      setMessage(response.data.message);
    } catch (error) {
      if (error.response && error.response.status == 401) {
        redirectToLogin();
      } else {
        console.log("Error updating article");
        setMessage("An error occurred while updating the article.");
      }
    } finally {
      setSpinnerOn(false);
    }
  };

  const deleteArticle = async (article_id) => {
    setMessage("");
    setSpinnerOn(true);
    try {
      const token = localStorage.getItem("token");
      console.log("Deleting Article ID:", article_id);
      const response = await axios.delete(`${articlesUrl}/${article_id}`, {
        headers: {
          Authorization: token,
        },
      });
       await getArticles();
      setMessage(response.data.message);
     
    } catch (error) {
      if (error?.response.status == 401) redirectToLogin();
    } finally {
      setSpinnerOn(false);
    }
  };

  
  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm 
            getArticles={getArticles}
            postArticle={postArticle}
            updateArticle={updateArticle}
            article={articles.find(article => article.article_id === currentArticleId)}
            currentArticleId={currentArticleId}
            setCurrentArticleId={setCurrentArticleId}

              />
              <Articles 
           getArticles={getArticles}
           updateArticle={updateArticle}
           deleteArticle={deleteArticle}
           articles={articles}
           currentArticleId={currentArticleId}
           setCurrentArticleId={setCurrentArticleId}
           
         
              />

            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
