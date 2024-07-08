

export async function insertStats(token, { favorited, userId, watched, videoId }) {
    const operationsDoc = `
      mutation insertStats($favorited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
        insert_stats_one(object: {
            favorited: $favorited, 
            userId: $userId, 
            watched: $watched, 
            videoId: $videoId
        }) {
          favorited,
          userId,
        }
      }
    `;

    return await queryHasuraGQL(
        operationsDoc,
        "insertStats",
        { favorited, userId, watched, videoId },
        token
    );
}

export async function updateStats(token, { favorited, userId, watched, videoId }) {
    const operationsDoc = `
    mutation updateStats($favorited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
      update_stats(
        _set: {watched: $watched, favorited: $favorited}, 
        where: {
          _and: [
            { userId: { _eq: $userId } }, 
            { videoId: { _eq: $videoId } }
          ]
        }) {
        returning {
          favorited,
          userId,
          watched,
          videoId
        }
      }
    }
    `;

    return await queryHasuraGQL(
        operationsDoc,
        "updateStats",
        { favorited, userId, watched, videoId },
        token
    );
}

export async function createNewUser(token, metadata) {
    const operationsDoc = `
      mutation createNewUser($issuer: String!, $email: String!, $publicAddress: String!) {
        insert_users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
          returning {
            email
            id
            issuer
          }
        }
      }
    `;

    const { issuer, email, publicAddress } = metadata;
    return await queryHasuraGQL(
        operationsDoc,
        "createNewUser",
        {
            issuer,
            email,
            publicAddress,
        },
        token
    );
}

export async function isNewUser(token, issuer) {
    const operationsDoc = `
      query isNewUser($issuer: String!) {
        users(where: {issuer: {_eq: $issuer}}) {
          id
          email
          issuer
        }
      }
    `;

    const response = await queryHasuraGQL(
        operationsDoc,
        "isNewUser",
        {
            issuer,
        },
        token
    );
    return response?.data?.users?.length === 0;
}

export async function findVideoIdByUser(userId, videoId, token) {
    const operationsDoc = `
      query findVideoIdByUser($userId: String!, $videoId: String!) {
        stats(where: {userId: {_eq: $userId}, 
        videoId: {_eq: $videoId}}) 
        {
          id
          userId
          videoId
          watched
          favorited
        }
      }
      
      mutation MyMutation {
        __typename
      }
    `;

    const response = await queryHasuraGQL(
        operationsDoc,
        "findVideoIdByUser",
        {
            videoId,
            userId,
        },
        token
    );
    return response?.data?.stats;
}

export async function queryHasuraGQL(operationsDoc, operationName, variables, token) {
    const result = await fetch(process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            query: operationsDoc,
            variables: variables,
            operationName: operationName,
        }),
    });

    return await result.json();
}

export async function getWatchedVideos(userId, token) {
    const operationsDoc = `
      query watchedVideos($userId: String!) {
        stats(where: {
          watched: {_eq: true}, 
          userId: {_eq: $userId},
        }) {
          videoId
          watched
        }
      }
    `;

    const response = await queryHasuraGQL(
        operationsDoc,
        "watchedVideos",
        {
            userId,
        },
        token
    );

    return response?.data?.stats;
}

export async function getMyListVideos(userId, token) {
    const operationsDoc = `
      query favoritedVideos($userId: String!) {
        stats(where: {
          userId: {_eq: $userId}, 
          favorited: {_eq: 1}
        }) {
          videoId
        }
      }
    `;

    const response = await queryHasuraGQL(
        operationsDoc,
        "favoritedVideos",
        {
            userId,
        },
        token
    );

    return response?.data?.stats;
}