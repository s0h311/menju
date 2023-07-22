import {Card, CardContent, Typography} from "@mui/material";
import React from "react";
import {FoodItemModel} from "@/app/model/food-item.model";

interface FoodItemProps {
    item: FoodItemModel;
}

export default function FoodItem({item}: FoodItemProps) {
    return (
        <Card className="overflow-y-auto no-scrollbar" sx={{minWidth: 300}}>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {item.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Lizards are a widespread group of squamate reptiles, with over 6,000
                    species, ranging across all continents except Antarctica
                </Typography>
            </CardContent>
        </Card>
    );
}