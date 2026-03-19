---
title: Meet the DocumentDB Kubernetes Operator
description: Run MongoDB workloads on PostgreSQL, anywhere Kubernetes runs. Preview the open-source, MIT-licensed operator that brings automated high availability, multi-cloud replication, backup and restore, and enterprise security to DocumentDB on Kubernetes.
date: 2026-03-19
featured: true
author: DocumentDB team
category: documentdb-blog
tags:
  - Kubernetes
  - Operator
  - DocumentDB
  - Open Source
  - MongoDB Alternative
  - PostgreSQL
  - Multi-Cloud Database
---
MongoDB compatibility. PostgreSQL reliability. Kubernetes simplicity. The new [DocumentDB Kubernetes Operator](https://github.com/documentdb/documentdb-kubernetes-operator) brings all three together in a single open-source project — and it is available today as a public preview.

Running a document database on Kubernetes should not require a maze of hand-built scripts for failover, certificate handling, backup jobs, and day-two troubleshooting. The DocumentDB Kubernetes Operator turns that operational work into a Kubernetes-native workflow: declare what you want, and the operator reconciles the rest.

## What is DocumentDB?

[DocumentDB](https://github.com/documentdb/documentdb) is the engine powering vCore-based Azure Cosmos DB for MongoDB. Built on PostgreSQL, it provides a native document-oriented NoSQL database with support for CRUD operations on BSON data types. The project is governed by the **Linux Foundation** with a Technical Steering Committee that includes representatives from Microsoft, Amazon, AB InBev, Rippling, and YugabyteDB.

Building on PostgreSQL means DocumentDB inherits decades of enterprise reliability, a vast ecosystem of operational tooling, and a talent pool far larger than any single NoSQL database. It also means no SSPL licensing constraints — **DocumentDB and the Kubernetes Operator are both fully open-source under the MIT license**.

The Kubernetes Operator runs and manages DocumentDB on Kubernetes: when you deploy a cluster, it creates and manages PostgreSQL instances, the [DocumentDB Gateway](https://github.com/documentdb/documentdb/tree/main/pg_documentdb_gw), and the supporting Kubernetes resources around them. Because the gateway provides full MongoDB wire protocol compatibility, existing MongoDB drivers — PyMongo, Node.js, Java, Go, C++ — **connect without code changes**. Teams swap a connection string, not their application.

## Why this matters

Kubernetes teams have strong patterns for stateless applications, but data services often still depend on custom runbooks and fragile operational glue. The DocumentDB Kubernetes Operator closes that gap by giving platform teams a single declarative control surface for deployment, availability, security, and recovery — with zero database licensing fees.

With the preview release, you can:

- Install the operator with a single Helm command (CloudNativePG is included as a dependency)
- Deploy a DocumentDB cluster through a Kubernetes custom resource
- Connect with `mongosh` and any MongoDB-compatible driver or tool
- Manage backup, restore, TLS, and promotion workflows through Kubernetes-native APIs
- Deploy across Azure AKS, AWS EKS, Google GKE, or on-premises Kubernetes

## From zero to a live MongoDB-compatible endpoint

The quickstart is intentionally direct. Install `cert-manager`, install the operator, create a Secret for gateway credentials, and apply a `DocumentDB` resource. The public preview docs target Kubernetes 1.35+ and call out local development with `kind` (v0.31+) and `minikube`, while also showing cloud-friendly access patterns through `LoadBalancer` services on AKS, EKS, and GKE.

At the heart of that flow is a simple custom resource:

```yaml
apiVersion: documentdb.io/preview
kind: DocumentDB
metadata:
  name: documentdb-preview
  namespace: documentdb-preview-ns
spec:
  nodeCount: 1
  instancesPerNode: 1
  documentDbCredentialSecret: documentdb-credentials
  resource:
    storage:
      pvcSize: 10Gi
  exposeViaService:
    serviceType: ClusterIP
```

Once the cluster reports a healthy state, you can connect locally with port forwarding or expose it through a load balancer in supported environments. The result is a much shorter path from cluster creation to a live MongoDB-compatible endpoint — ready for `mongosh`, PyMongo, or any MongoDB driver your team already uses.

## Built for day-two operations

Bringing up a cluster is only the beginning, so the operator is opinionated about day-two workflows as well.

Set `instancesPerNode: 3` and the operator creates one primary instance and two replicas for local high availability. If the primary fails, a replica is promoted automatically — typically within **5 to 15 seconds** for unplanned failures, and **2 to 5 seconds** for planned switchovers. Use `Backup` and `ScheduledBackup` resources for on-demand and scheduled backups with retention policies, and restore into a new cluster when needed. And when operators need visibility, the `kubectl documentdb` plugin provides purpose-built commands: `status` for cluster health and connection strings, `events` for streaming Kubernetes events, and `promote` for controlled primary promotion.

That makes the operator valuable not only for first deployment, but for the operational rhythm that follows: health checks, recovery planning, planned changes, and repeatable workflows that fit naturally into Kubernetes.

## Security and connectivity built in

Secure connectivity is part of the model from the start. The DocumentDB gateway always encrypts client connections; the `spec.tls.gateway.mode` field controls how the operator manages certificates. Four modes cover the full spectrum of deployment environments:

- `Disabled` — the gateway still encrypts connections using an internally generated certificate; ideal for quick development setups
- `SelfSigned` — the operator generates and manages self-signed certificates for development and test environments
- `CertManager` — integrates with cert-manager for clusters that already standardize on it
- `Provided` — bring your own certificates for organizations that manage PKI processes independently

The same declarative pattern carries into networking. The operator supports local development through `ClusterIP` plus port forwarding, and cloud exposure through `LoadBalancer` services with cloud-specific annotations for AKS, EKS, and GKE. Teams declare the configuration they need instead of reinventing it.

## Multi-cloud and multi-environment deployment

The operator is designed to run across multiple cloud providers and Kubernetes distributions. The multi-cluster guidance includes a documented KubeFleet-based deployment pattern spanning AKS and on-premises Kubernetes clusters, while the broader platform documentation covers deployment and configuration guidance for AKS, EKS, and GKE.

That is a meaningful capability for teams that want Kubernetes-native control over data placement and replication without locking their operational model to a single cloud provider — especially when combined with the operator's zero licensing cost.

Promotion across environments is an intentional operational action, surfaced through Kubernetes resources and the `kubectl documentdb promote` workflow. That explicit design is often exactly right when changes cross infrastructure or compliance boundaries.

## Modern workloads, not just MongoDB compatibility

DocumentDB goes beyond basic MongoDB compatibility. The engine supports **vector search** with up to 4,000-dimensional vectors and half-precision support, making it ready for AI and machine learning workloads. **Change streams** enable real-time monitoring of collection changes for event-driven architectures. And features like advanced aggregation pipelines, geospatial queries, text search, and ACID transactions mean teams can build modern applications without outgrowing the platform.

## Why try it now

The project is still in preview, and the public docs are clear that it is not yet recommended for production workloads. That is exactly why now is the right time to evaluate it.

If your team is exploring MongoDB alternatives, looking to reduce database licensing costs, or wants to bring document database management into a Kubernetes-native workflow, this preview gives you a concrete way to do it: start locally, inspect the control model, test backup and restore, evaluate TLS options, and explore the operator experience before general availability.

Because DocumentDB runs on your existing Kubernetes infrastructure with zero licensing fees, it offers a fundamentally different cost model from managed MongoDB services — while keeping the driver compatibility your applications already depend on.

## Get started

- **[DocumentDB Kubernetes Operator on GitHub](https://github.com/documentdb/documentdb-kubernetes-operator)** — star the repo, explore the code, file issues
- **[DocumentDB engine on GitHub](https://github.com/documentdb/documentdb)** — the open-source database engine
- [Quickstart guide](https://github.com/documentdb/documentdb-kubernetes-operator/blob/main/docs/operator-public-documentation/preview/index.md) — from install to a connected cluster
- [Backup and restore guide](https://github.com/documentdb/documentdb-kubernetes-operator/blob/main/docs/operator-public-documentation/preview/backup-and-restore.md)
- [kubectl-documentdb plugin](https://github.com/documentdb/documentdb-kubernetes-operator/blob/main/docs/operator-public-documentation/preview/kubectl-plugin.md)
- [TLS configuration guide](https://github.com/documentdb/documentdb-kubernetes-operator/blob/main/docs/operator-public-documentation/preview/configuration/tls.md)
- [Multi-cluster deployment guide](https://github.com/documentdb/documentdb-kubernetes-operator/blob/main/docs/developer-guides/manual-multi-cloud-deployment-guide.md)

The project is MIT-licensed and welcomes contributions — from bug reports and feature requests to documentation and code. Help shape the future of document databases on Kubernetes.
