FROM node 

COPY . /workspace

WORKDIR /workspace

EXPOSE 3000

ENTRYPOINT ["npm", "start"]