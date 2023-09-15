/**
 * Récupère des données à partir d'une URL via une requête asynchrone.
 *
 * @param {string} url - L'URL à partir de laquelle récupérer les données.
 * @returns {Promise} - Une promesse qui se résout avec les données au format JSON ou se rejette en cas d'erreur.
 */
async function fetchData(url) {
	try {
		const res = await fetch(url)
		if (!res.ok) {
			throw new Error('Connexion au serveur impossible')
		}
		return res.json()
	} catch (error) {
		console.error(error)
	}
}

/**
 * Trie un tableau d'utilisateurs en fonction de leur prénom et nom.
 *
 * @param {Array} users - Un tableau d'objets représentant les utilisateurs à trier.
 * @returns {Array} - Un tableau contenant les utilisateurs triés par prénom et nom.
 */
function sortFirstLastName(users) {
	const arrayUsers = [...users]

	arrayUsers.sort(function (a, b) {
		const firstNameComparison = a.name.first.localeCompare(b.name.first)

		if (firstNameComparison === 0) {
			return a.name.last.localeCompare(b.name.last)
		}
		return firstNameComparison
	})

	return arrayUsers
}

/**
 * Affiche la liste des utilisateurs dans la table des résultats.
 *
 * @param {Array} dataUsers - Un tableau d'objets représentant les utilisateurs à afficher.
 */
function showUsers(dataUsers) {
	for (const user of dataUsers) {
		const element = `<li class="table-item">
            <p class="main-info">
                <img src=${user.picture.thumbnail} alt="avatar picture">
                <span>${user.name.first} ${user.name.last}</span>
            </p>
            <p class="email">${user.email}</p>
            <p class="phone">${user.phone}</p>
        </li>`
		tableResult.innerHTML += element
	}
}

/**
 * Trie les utilisateurs en fonction d'une chaîne de caractères recherchée dans leurs prénoms, noms, ou combinaisons.
 *
 * @param {Array} dataUsers - Un tableau d'objets représentant les utilisateurs.
 * @param {string} searchedString - La chaîne de caractères recherchée (insensible à la casse).
 * @returns {Array} - Un tableau contenant les utilisateurs correspondant à la recherche.
 */
function sortUsers(dataUsers, searchedString) {
	const arrayUsers = []

	for (const user of dataUsers) {
		const firstName = user.name.first.toUpperCase()
		const lastName = user.name.last.toUpperCase()
		const firstLast = firstName + lastName
		const lastFirst = lastName + firstName

		if (
			firstName.includes(searchedString) ||
			lastName.includes(searchedString) ||
			firstLast.includes(searchedString) ||
			lastFirst.includes(searchedString)
		) {
			arrayUsers.push(user)
		}
	}
	return arrayUsers
}

/**
 * Gère l'événement de changement de la valeur de recherche et met à jour la liste des utilisateurs.
 *
 * @param {Event} e - L'objet d'événement représentant l'événement d'entrée.
 */
function handleInputChange(e) {
	const searchedString = e.target.value.toUpperCase().replace(/\s/g, '')

	const arrayUsers = sortUsers(sortArrayUsers, searchedString)
	tableResult.innerHTML = ''
	showUsers(arrayUsers)
}

const data = await fetchData('https://randomuser.me/api/?nat=fr&results=50')
const tableResult = document.getElementById('table-results')
const search = document.getElementById('search')
const sortArrayUsers = sortFirstLastName(data.results)

showUsers(sortArrayUsers)

search.addEventListener('input', handleInputChange)
