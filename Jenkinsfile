@Library(value='jenkins-pipeline-library@master', changelog=false) _
pipelineRDPCRdpcUI(
    buildImage: "node:18.12.0",
    dockerRegistry: "ghcr.io",
    dockerRepo: "icgc-argo/rdpc-ui",
    gitRepo: "icgc-argo/rdpc-ui",
    testCommand: "npm ci && npm t",
    helmRelease: "rdpc-ui"
)

