package main

import (
	"context" //**
	"fmt"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"           //**
	"go.mongodb.org/mongo-driver/bson/primitive" //**
	"go.mongodb.org/mongo-driver/mongo"          //**
	"go.mongodb.org/mongo-driver/mongo/options"  //**
)

// Config
var mongoUri string = "mongodb://localhost:27017"
var mongoDbName string = "ars_app_db"

// Database variables
var mongoClient *mongo.Client
var pizzaCollection *mongo.Collection

type Pizza struct {
	Id          primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Name      	string             `json:"name" bson:"name"`
	Size      	string             `json:"size" bson:"size"` 
	Category 	string             `json:"category" bson:"category"`
	Price       float64            `json:"price" bson:"price"`
}
// sizes standard - 8 inch or 10 inch
// category - Indian, Chinese, Italian

// mongo connect
func connectToMongo() {
	var err error
	mongoClient, err = mongo.Connect(context.TODO(), options.Client().ApplyURI(mongoUri))
	if err != nil {
		fmt.Println("Mongo DB Connection Error!" + err.Error())
		return
	}
	name := "pizzas"
	pizzaCollection = mongoClient.Database(mongoDbName).Collection(name)
}

// apis
func createPizza(c *gin.Context) {
	var pizza Pizza
	if err := c.BindJSON(&pizza); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server Error." + err.Error()})
		return
	}
	//
	pizza.Id = primitive.NewObjectID()
	_, err := pizzaCollection.InsertOne(context.TODO(), pizza)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server Error.\n" + err.Error()})
		return
	}
	//
	c.JSON(http.StatusCreated,
		gin.H{"message": "Pizza Created Successfully", "pizza": pizza})
}

func readAllPizzas(c *gin.Context) {
	//
	var pizzas []Pizza
	cursor, err := pizzaCollection.Find(context.TODO(), bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server Error.\n" + err.Error()})
		return
	}
	defer cursor.Close(context.TODO())
	//
	pizzas = []Pizza{}
	err = cursor.All(context.TODO(), &pizzas)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server Error.\n" + err.Error()})
		return
	}
	//
	c.JSON(http.StatusOK, pizzas)
}

func readPizzaById(c *gin.Context) {
	id := c.Param("id")
	//
	pizzaId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID.\n" + err.Error()})
		return
	}
	//
	var pizza Pizza
	err = pizzaCollection.FindOne(context.TODO(), bson.M{"_id": pizzaId}).Decode(&pizza)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Pizza Not Found."})
		return
	}
	//
	c.JSON(http.StatusOK, pizza)
}

func updatePizza(c *gin.Context) {
	id := c.Param("id")
	pizzaId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID.\n" + err.Error()})
		return
	}
	//
	var oldPizza Pizza
	err = pizzaCollection.FindOne(context.TODO(), bson.M{"_id": pizzaId}).Decode(&oldPizza)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Pizza Not Found."})
		return
	}
	//
	var jbodyPizza Pizza
	err = c.BindJSON(&jbodyPizza)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server Error." + err.Error()})
		return
	}
	oldPizza.Size = jbodyPizza.Size
	//
	_, err = pizzaCollection.UpdateOne(context.TODO(),
		bson.M{"_id": pizzaId},
		bson.M{"$set": bson.M{"size": jbodyPizza.Size}})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server Error." + err.Error()})
		return
	}
	//response
	c.JSON(http.StatusOK, gin.H{"message": "Pizza Updated Successfully", "pizza": oldPizza})
}

func deletePizza(c *gin.Context) {
	id := c.Param("id")
	pizzaId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID.\n" + err.Error()})
		return
	}
	// retrival of pizza found
	var oldPizza Pizza
	err = pizzaCollection.FindOne(context.TODO(), bson.M{"_id": pizzaId}).Decode(&oldPizza)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Pizza Not Found."})
		return
	}
	//delete
	_, err = pizzaCollection.DeleteOne(context.TODO(), bson.M{"_id": pizzaId})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server Error." + err.Error()})
		return
	}
	//response
	c.JSON(http.StatusOK, gin.H{"message": "Pizza deleted successfully."})
}

func main() {
	//
	connectToMongo()
	//router
	r := gin.Default()
	//cors
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // React frontend URL
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	//routes
	r.POST("/pizzas", createPizza)
	r.GET("/pizzas", readAllPizzas)
	r.GET("/pizzas/:id", readPizzaById)
	r.PUT("/pizzas/:id", updatePizza)
	r.DELETE("/pizzas/:id", deletePizza)
	//server
	r.Run(":8080")
}


