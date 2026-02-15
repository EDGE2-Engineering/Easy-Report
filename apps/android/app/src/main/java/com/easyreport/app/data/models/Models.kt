package com.easyreport.app.data.models

import java.util.UUID

data class Client(
    val id: String,
    val clientName: String,
    val clientAddress: String = "",
    val email: String = "",
    val phone: String = ""
)

data class Report(
    val id: String = UUID.randomUUID().toString(),
    val reportNumber: String,
    val clientId: String,
    val date: String,
    val status: String = "Draft",
    val content: String = ""
)

data class Service(
    val id: String,
    val serviceType: String,
    val price: Double,
    val unit: String,
    val qty: Double,
    val sampling: String? = null
)
