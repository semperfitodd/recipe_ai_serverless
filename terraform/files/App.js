import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import {
    CognitoUserPool,
    CognitoUser,
    AuthenticationDetails,
    CognitoUserAttribute,
} from 'amazon-cognito-identity-js';

const poolData = {
    UserPoolId: '<COGNITO_USER_POOL_ID>',
    ClientId: '<COGNITO_APP_CLIENT_ID>',
};

const userPool = new CognitoUserPool(poolData);

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [email, setEmail] = useState('');
    const [givenName, setGivenName] = useState('');
    const [familyName, setFamilyName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [userId, setUserId] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [previousRecipes, setPreviousRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [selectedUnits, setSelectedUnits] = useState('imperial');

    const apiUrl = '<API_INVOKE_URL>';

    const handleLogin = () => {
        const authenticationDetails = new AuthenticationDetails({
            Username: username,
            Password: password,
        });

        const cognitoUser = new CognitoUser({
            Username: username,
            Pool: userPool,
        });

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: (result) => {
                setIsLoggedIn(true);
                setUserId(username);
            },
            onFailure: (err) => {
                console.error(err);
            },
            newPasswordRequired: () => {
                setIsUpdatingPassword(true);
            },
        });
    };

    const handleUpdatePassword = () => {
        const cognitoUser = new CognitoUser({
            Username: username,
            Pool: userPool,
        });

        cognitoUser.completeNewPasswordChallenge(newPassword, null, {
            onSuccess: (result) => {
                setIsLoggedIn(true);
                setUserId(username);
                setIsUpdatingPassword(false);
            },
            onFailure: (err) => {
                console.error(err);
            },
        });
    };

    const handleSignUp = () => {
        const attributeList = [
            new CognitoUserAttribute({ Name: 'email', Value: email }),
            new CognitoUserAttribute({ Name: 'given_name', Value: givenName }),
            new CognitoUserAttribute({ Name: 'family_name', Value: familyName }),
            new CognitoUserAttribute({ Name: 'phone_number', Value: phoneNumber }),
        ];

        userPool.signUp(username, password, attributeList, null, (err, result) => {
            if (err) {
                alert(err.message || JSON.stringify(err));
                return;
            }
            setIsSignUp(false);
        });
    };

    const fetchPreviousRecipes = async () => {
        if (!userId) {
            alert("Please enter a User ID");
            return;
        }

        try {
            const response = await axios.get(apiUrl, {
                params: {
                    user_id: userId
                }
            });
            setPreviousRecipes(response.data);
        } catch (error) {
            console.error('Error fetching previous recipes:', error);
        }
    };

    const generateRecipe = async () => {
        if (!userId) {
            alert("Please enter a User ID");
            return;
        }

        setLoading(true);

        try {
            await axios.post(apiUrl, {
                user_id: userId,
                ingredients_list: ingredients.split(',').map(ingredient => ingredient.trim()),
                language: selectedLanguage,
                units: selectedUnits
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            fetchPreviousRecipes();
        } catch (error) {
            console.error('Error generating recipe:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App">
            {!isLoggedIn && !isUpdatingPassword && (
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {!isSignUp && (
                        <button onClick={handleLogin}>Login</button>
                    )}
                    {isSignUp && (
                        <div>
                            <input
                                type="text"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Given Name"
                                value={givenName}
                                onChange={(e) => setGivenName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Family Name"
                                value={familyName}
                                onChange={(e) => setFamilyName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Phone Number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                            <button onClick={handleSignUp}>Sign Up</button>
                        </div>
                    )}
                    <button onClick={() => setIsSignUp(!isSignUp)}>
                        {isSignUp ? 'Go to Login' : 'Go to Sign Up'}
                    </button>
                </div>
            )}

            {isUpdatingPassword && (
                <div>
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button onClick={handleUpdatePassword}>Update Password</button>
                </div>
            )}

            {isLoggedIn && (
                <div className="recipe-generator">
                    <h1>Recipe Generator</h1>
                    <input
                        type="text"
                        placeholder="Ingredients (comma separated)"
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                    />
                    <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                    </select>
                    <select value={selectedUnits} onChange={(e) => setSelectedUnits(e.target.value)}>
                        <option value="imperial">Imperial</option>
                        <option value="metric">Metric</option>
                    </select>
                    <button onClick={generateRecipe} disabled={loading}>
                        Generate Recipe
                    </button>
                    <button onClick={fetchPreviousRecipes}>
                        Get Past Recipes
                    </button>
                    {loading && <div>Loading...</div>}
                    <div className="previous-recipes">
                        <h2 style={{ textAlign: "center" }}>Previous Recipes</h2>
                        <ul style={{ listStyleType: 'none', paddingInlineStart: '0px' }}>
                            {previousRecipes.map((recipe, index) => (
                                <li key={index}>
                                    <div style={{ textAlign: "center" }}><strong>{recipe.title}</strong></div>
                                    <div style={{ textAlign: "center" }}><strong>Date:</strong> {recipe.date}</div>
                                    <div style={{ textAlign: "center" }}><strong>Ingredients</strong></div>
                                    <ol style={{ textAlign: "left" }}>
                                        {recipe.ingredients_list.split('\n').filter(ingredient => ingredient.trim()).map((ingredient, ingredientIndex) => (
                                            <li key={ingredientIndex}>
                                                {ingredient.replace(/^- /, '').trim()}
                                            </li>
                                        ))}
                                    </ol>
                                    <div style={{ textAlign: "center" }}><strong>Instructions</strong></div>
                                    <ol style={{ textAlign: "left" }}>
                                        {recipe.instructions.split('\n').filter(instruction => instruction.trim()).map((instruction, instructionIndex) => (
                                            <li key={instructionIndex}>
                                                {instruction.replace(/^\d+\.\s*/, '').trim()}
                                            </li>
                                        ))}
                                    </ol>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;