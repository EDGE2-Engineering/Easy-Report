package com.easyreport.app.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.easyreport.app.data.models.Report

@Composable
fun DashboardScreen(reports: List<Report>) {
    Column(modifier = Modifier.padding(16.dp)) {
        Text("Recent Reports", style = MaterialTheme.typography.headlineSmall)
        Spacer(modifier = Modifier.height(8.dp))
        
        LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            items(reports) { report ->
                ReportItem(report)
            }
        }
    }
}

@Composable
fun ReportItem(report: Report) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                Text(report.reportNumber, style = MaterialTheme.typography.titleMedium)
                Text(report.status, color = MaterialTheme.colorScheme.primary)
            }
            Text(report.date, style = MaterialTheme.typography.bodySmall)
        }
    }
}
