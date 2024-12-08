const API_BASE_URL = 'https://sneakershop-6lmk.onrender.com/api/v1/orders'; // Pas aan met jouw API-basis-URL

export async function createOrder(orderData) {
    try {
        console.log('Sending order data to API:', orderData);
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error creating order:', errorData);
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response data:', data); 
        return data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
}

export async function getUser() {
    try {
        const response = await fetch('https://sneakershop-6lmk.onrender.com/api/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // JWT-token in localStorage
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data; // Retourneert de gebruikersinformatie
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}
