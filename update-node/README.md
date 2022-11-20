Updates node in each of the repos to the version of node currently installed on this machine.

- Drops a .node-version file to the repo
- Reruns npm install to update lockfiles

Sample

```
multi-gitter run "node /home/kevin/src/multi-gitter-tasks/update-node/update-node.js" --dry-run --user kj800x --pr-title "Upgrade to Node 18.12.1"
```
