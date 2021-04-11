// массив юзеров
const users = [];

//доп методы для работы с массивом


// функция добавления юзера
const addUser = ({ id, name, room }) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existingUser = users.find((user) => user.room === room && user.name === name);

    if(!name || !room) return { error: 'Username and room are required.' };
    if(existingUser) return { error: 'Username is taken.' };

    const user = { id, name, room };

    users.push(user);

    return { user };
}

// функция удаления юзера
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if(index !== -1) return users.splice(index, 1)[0];
}

// поиск юзера по id
const getUser = (id) => users.find((user) => user.id === id);

// возвращаем всех юзеров в комнате
const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };