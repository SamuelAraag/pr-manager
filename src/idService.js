
const IdService = {
    /**
     * Generates a unique ID (hash-like) ensuring it doesn't exist in the provided list.
     * @param {Array} existingIds - Array of existing IDs to check against for collisions.
     * @param {number} length - Length of the generated ID (default 8).
     * @returns {string} A unique alphanumeric ID.
     */
    generateUniqueId(existingIds = [], length = 8) {
        let newId;
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        
        do {
            let result = '';
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            newId = result;
        } while (existingIds.includes(newId));

        return newId;
    },

    /**
     * Extracts all IDs from a list of objects.
     * @param {Array} collection - Array of objects (e.g., PRs).
     * @param {string} key - The key to extract (default 'id').
     * @returns {Array} Array of IDs.
     */
    extractIds(collection, key = 'id') {
        return collection.map(item => item[key]).filter(id => id !== undefined && id !== null);
    }
};

export { IdService };
