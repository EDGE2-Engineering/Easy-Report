package com.easyreport.app.data.repository

import com.easyreport.app.data.models.Client
import com.easyreport.app.data.models.Report
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

interface ReportRepository {
    fun getReports(): Flow<List<Report>>
    suspend fun createReport(report: Report)
}

interface ClientRepository {
    fun getClients(): Flow<List<Client>>
}

// Mock Implementation for initial UI development
class MockReportRepository : ReportRepository {
    override fun getReports(): Flow<List<Report>> = flow {
        emit(listOf(
            Report(reportNumber = "REP-001", clientId = "C1", date = "2024-02-15", status = "Completed"),
            Report(reportNumber = "REP-002", clientId = "C2", date = "2024-02-16", status = "Draft")
        ))
    }

    override suspend fun createReport(report: Report) {
        // Mock save
    }
}
