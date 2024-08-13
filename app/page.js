'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import {
  collection,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  setDoc,
  doc,
} from 'firebase/firestore';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { Box, Stack, Typography, Button, TextField } from '@mui/material';

export default function Home() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);

  const updateItems = async () => {
    const snapshot = query(collection(firestore, 'items'));
    const docs = await getDocs(snapshot);
    const itemsList = [];
    docs.forEach((doc) => {
      itemsList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setItems(itemsList);
    console.log(items);
  };

  const addItem = async (item, inputQuantity) => {
    const docRef = doc(collection(firestore, 'items'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: inputQuantity });
    }
    updateItems();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'items'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    updateItems();
  };

  const deleteItem = async (item) => {
    const docRef = doc(collection(firestore, 'items'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await deleteDoc(docRef);
    }
    updateItems();
  };

  useEffect(() => {
    updateItems();
  }, []);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      bgcolor="#efeff5"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      overflow="auto"
      gap={2}
    >
      <Box>
        <Stack width="100%" direction="row" spacing={2}>
          <TextField
            label="Item Name"
            variant="outlined"
            width="400px"
            value={itemName}
            onChange={(e) => {
              setItemName(e.target.value);
            }}
          />
          <TextField
            id="outlined-number"
            label="Quantity"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
            }}
          />
          <Button
            variant="outlined"
            onClick={() => {
              addItem(itemName, quantity);
              setItemName('');
              setQuantity(0);
            }}
          >
            Add Item
          </Button>
        </Stack>
      </Box>
      <Box border="2px solid #333" bgcolor="white">
        <Box
          width="900px"
          height="100px"
          bgcolor="#AAAEEE"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h2">Items List</Typography>
        </Box>
        <Stack
          width="900px"
          height="400px"
          spacing={1}
          overflow="auto"
          justifyContent="space-between"
        >
          {items.map((item) => {
            return (
              <Box
                key={item.name}
                width="100%"
                minHeight="150px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgColor="#f0f0f0"
                padding={5}
              >
                <Typography
                  variant="h4"
                  color="#333"
                  textAlign="left"
                  width="200px"
                >
                  {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                </Typography>
                <Typography
                  variant="h4"
                  color="#333"
                  textAlign="center"
                  width="200px"
                >
                  {item.quantity}
                </Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="right"
                  width="300px"
                >
                  <Button
                    variant="contained"
                    onClick={() => {
                      addItem(item.name);
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      removeItem(item.name);
                    }}
                  >
                    Remove
                  </Button>
                  <Button
                    variant="text"
                    onClick={() => {
                      deleteItem(item.name);
                    }}
                  >
                    <IconButton aria-label="delete">
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </Button>
                </Stack>
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}
