import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Picker } from '@react-native-picker/picker';

const Stack = createStackNavigator();

// Function to calculate the average price of menu items by course
const calculateAveragePrice = (menuItems, course) => {
  const itemsByCourse = menuItems.filter(item => item.course === course);
  const total = itemsByCourse.reduce((sum, item) => sum + parseFloat(item.price), 0);
  return itemsByCourse.length ? (total / itemsByCourse.length).toFixed(2) : 0;
};

// Custom Button Component for styling
const CustomButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

// Home Screen
function HomeScreen({ navigation, route }) {
  const menuItems = route.params?.menuItems || [];

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://th.bing.com/th/id/R.1de90fb7ed34cbe9476248e9b90bd984?rik=IuGOBkKk4L2yVQ&riu=http%3a%2f%2fwallpapercave.com%2fwp%2fwp1882365.jpg&ehk=FgTAgHa7ZQ2WR2zBKndnib2XyiXn4%2bFJHfFOvrBXdPM%3d&risl=&pid=ImgRaw&r=0' }} 
        style={styles.logo} 
      />
      <Text style={styles.header}>Chef's Menu</Text>
      <Text>Total Menu Items: {menuItems.length}</Text>
      
      {/* Display the average prices for each course */}
      <Text>Average Price for Starters: R{calculateAveragePrice(menuItems, 'Appertizers')}</Text>
      <Text>Average Price for Mains: R{calculateAveragePrice(menuItems, 'Entrees')}</Text>
      <Text>Average Price for Dessert: R{calculateAveragePrice(menuItems, 'Dessert')}</Text>
      <Text>Average Price for Dessert: R{calculateAveragePrice(menuItems, 'Drinks')}</Text>
      <Text>Average Price for Dessert: R{calculateAveragePrice(menuItems, 'Specials')}</Text>

      {/* Display the full menu */}
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Text style={styles.menuText}>{item.dishName} - {item.course} - R{item.price}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />

      <CustomButton title="Add/Remove Menu Items" onPress={() => navigation.navigate('ManageMenu', { menuItems })} />
      <CustomButton title="Course Options" onPress={() => navigation.navigate('FilterMenu', { menuItems })} />
    </View>
  );
}

// Screen to add and remove menu items
function ManageMenuScreen({ navigation, route }) {
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Appertizers');
  const [price, setPrice] = useState('');
  const [menuItems, setMenuItems] = useState(route.params?.menuItems || []);

  const courses = ['Appertizers', 'Entrees', 'Deserts', 'Drinks', 'Specials'];
  const addMenuItem = () => {
    if (dishName && description && price) {
      const newItem = {
        id: Math.random().toString(),
        dishName,
        description,
        course,
        price,
      };
      setMenuItems([...menuItems, newItem]);
      setDishName('');
      setDescription('');
      setPrice('');
    } 
  };

  const removeMenuItem = (id) => {
    const updatedMenuItems = menuItems.filter(item => item.id !== id);
    setMenuItems(updatedMenuItems);
  };

  return (
    <View style={styles.container}>
    <Image 
        source={{ uri: 'https://www.tripsavvy.com/thmb/kL5B8z7NsopyNdBt0VOE0hdi3QI=/3865x2576/filters:fill(auto,1)/close-up-of-chef-in-kitchen-adding-salad-garnish-to-a-plate-with-grilled-fish--737175405-5b0c0d0a119fa8003715aef7.jpg' }} 
        style={styles.logo} 
      />
      <Text style={styles.header}>Menu Items</Text>

      {/* Input fields for new menu item */}
      <TextInput style={styles.input} placeholder="Dish Name" value={dishName} onChangeText={setDishName} />
      <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />
      <Text style={styles.label}>Select Course</Text>
      <Picker selectedValue={course} style={styles.picker} onValueChange={setCourse}>
        {courses.map(item => <Picker.Item key={item} label={item} value={item} />)}
      </Picker>
      <TextInput style={styles.input} placeholder="Price (in ZAR)" value={price} onChangeText={setPrice} keyboardType="numeric" />

      <CustomButton title="Add Menu Item" onPress={addMenuItem} />

      {/* List of added menu items with remove functionality */}
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Text>{item.dishName} - {item.course} - R{item.price}</Text>
            <Text>{item.description}</Text>
            <TouchableOpacity onPress={() => removeMenuItem(item.id)}>
              <Text style={styles.removeButton}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <CustomButton title="Go Back" onPress={() => navigation.navigate('Home', { menuItems })} />
    </View>
  );
}

// Screen to filter menu items by course
function FilterMenuScreen({ route }) {
  const menuItems = route.params?.menuItems || [];
  const [selectedCourse, setSelectedCourse] = useState('Starters');

  const filteredItems = menuItems.filter(item => item.course === selectedCourse);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Course Options</Text>

      {/* Picker to select course for filtering */}
      <Picker selectedValue={selectedCourse} style={styles.picker} onValueChange={setSelectedCourse}>
        <Picker.Item label="Appertizers" value="Appertizers" />
        <Picker.Item label="Entrees" value="Entrees" />
        <Picker.Item label="Dessert" value="Dessert" />
        <Picker.Item label="Drinks" value="Drinks" />
        <Picker.Item label="Specials" value="Specials" />
      </Picker>

      {/* Display filtered menu items */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Text>{item.dishName} - R{item.price}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}

// Main App Component
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ManageMenu" component={ManageMenuScreen} />
        <Stack.Screen name="FilterMenu" component={FilterMenuScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff007d', // Bright pink background 
    padding: 20,
  },
  logo: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFF', // White text for the headers
    textAlign: 'left',
    marginVertical: 10,
    fontFamily: 'serif', // Add a serif font to match the style
  },
  label: {
    fontSize: 18,
    color: '#FFF', // White text for subheadings and labels
  },
  input: {
    height: 40,
    borderColor: '#FFF', // White borders
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#ff66b3', // Slightly lighter pink background
    color: '#FFF', // White text inside the input
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#FFF', // White text in picker
    backgroundColor: '#ff66b3',
    marginBottom: 10,
  },
  menuItem: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#ff66b3', // Light pink background
    borderRadius: 10,
  },
  menuText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF', // White text for menu items
  },
  removeButton: {
    color: '#FFF',
    marginTop: 10,
    backgroundColor: '#ff007d',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0008', // Pink buttons
    padding: 15,
    borderRadius: 1,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFF', // White text for buttons
    fontSize: 18,
    fontWeight: 'bold',
  },
});
