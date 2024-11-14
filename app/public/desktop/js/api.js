const fetchAPI = async (url, opt) => {
    try {
        let raw = JSON.stringify(opt);
        let Options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: raw
        };

        let res = await fetch(url, Options);
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const result = await res.json();
        return result;
    } catch (error) {
        console.error('Error fetching API:', error);
        throw error;
    }
}

async function fetchBlob(endpoint, data) {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/pdf' // Ensure the server knows you expect a PDF
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to fetch the PDF');
        }

        return await response.blob(); // Directly return the PDF as a Blob
    } catch (error) {
        console.error("Error fetching API:", error);
        throw error;
    }
}