import { create } from 'ipfs-http-client'

/**
 * IPFS Helper Functions
 * 
 * These functions are NOT currently used in the application.
 * They are here for future reference when IPFS integration is needed.
 */

// Initialize IPFS client with various providers
export const getIpfsClient = async (provider: 'infura' | 'pinata' | 'web3storage' | 'local' = 'infura') => {
  const configs = {
    infura: {
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
    },
    pinata: {
      host: 'api.pinata.cloud',
      port: 443,
      protocol: 'https',
    },
    web3storage: {
      host: 'api.web3.storage',
      port: 443,
      protocol: 'https',
    },
    local: {
      host: 'localhost',
      port: 5001,
      protocol: 'http',
    },
  }

  const config = configs[provider]
  
  return create({
    host: config.host,
    port: config.port,
    protocol: config.protocol,
  })
}

/**
 * Upload a file to IPFS
 * @param file - File object to upload
 * @returns IPFS hash (CID)
 */
export const uploadFileToIpfs = async (file: File): Promise<string> => {
  const ipfs = await getIpfsClient()
  
  try {
    const fileBuffer = await file.arrayBuffer()
    const result = await ipfs.add(fileBuffer)
    
    return result.cid.toString()
  } catch (error) {
    console.error('Error uploading file to IPFS:', error)
    throw error
  }
}

/**
 * Upload JSON data to IPFS
 * @param data - JSON object to upload
 * @returns IPFS hash (CID)
 */
export const uploadJsonToIpfs = async (data: Record<string, any>): Promise<string> => {
  const ipfs = await getIpfsClient()
  
  try {
    const jsonString = JSON.stringify(data)
    const result = await ipfs.add(jsonString)
    
    return result.cid.toString()
  } catch (error) {
    console.error('Error uploading JSON to IPFS:', error)
    throw error
  }
}

/**
 * Upload base64 data to IPFS
 * @param base64Data - Base64 encoded string
 * @returns IPFS hash (CID)
 */
export const uploadBase64ToIpfs = async (base64Data: string): Promise<string> => {
  const ipfs = await getIpfsClient()
  
  try {
    // Remove data URL prefix if present
    const base64 = base64Data.replace(/^data:.*,/, '')
    const buffer = Buffer.from(base64, 'base64')
    const result = await ipfs.add(buffer)
    
    return result.cid.toString()
  } catch (error) {
    console.error('Error uploading base64 to IPFS:', error)
    throw error
  }
}

/**
 * Retrieve data from IPFS by CID
 * @param cid - IPFS content identifier
 * @returns Uint8Array of data
 */
export const getFromIpfs = async (cid: string): Promise<Uint8Array> => {
  const ipfs = await getIpfsClient()
  
  try {
    const chunks = []
    for await (const chunk of ipfs.cat(cid)) {
      chunks.push(chunk)
    }
    
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
    const result = new Uint8Array(totalLength)
    
    let offset = 0
    for (const chunk of chunks) {
      result.set(chunk, offset)
      offset += chunk.length
    }
    
    return result
  } catch (error) {
    console.error('Error retrieving data from IPFS:', error)
    throw error
  }
}

/**
 * Retrieve JSON data from IPFS by CID
 * @param cid - IPFS content identifier
 * @returns Parsed JSON object
 */
export const getJsonFromIpfs = async (cid: string): Promise<any> => {
  const data = await getFromIpfs(cid)
  const text = new TextDecoder().decode(data)
  return JSON.parse(text)
}

/**
 * Pin content to IPFS using Pinata
 * @param cid - IPFS content identifier to pin
 * @param apiKey - Pinata API key
 * @param apiSecret - Pinata API secret
 * @returns Pin status
 */
export const pinToPinata = async (
  cid: string,
  apiKey: string,
  apiSecret: string
): Promise<any> => {
  const response = await fetch('https://api.pinata.cloud/pinning/pinByHash', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      pinata_api_key: apiKey,
      pinata_secret_api_key: apiSecret,
    },
    body: JSON.stringify({
      hashToPin: cid,
    }),
  })
  
  if (!response.ok) {
    throw new Error(`Failed to pin: ${response.statusText}`)
  }
  
  return await response.json()
}

/**
 * Get IPFS gateway URL for content
 * @param cid - IPFS content identifier
 * @param gateway - Gateway URL (default: ipfs.io)
 * @returns Full gateway URL
 */
export const getIpfsUrl = (cid: string, gateway: string = 'https://ipfs.io/ipfs/'): string => {
  return `${gateway}${cid}`
}

/**
 * Get alternative IPFS gateway URLs
 * @param cid - IPFS content identifier
 * @returns Object with various gateway URLs
 */
export const getIpfsUrls = (cid: string) => {
  return {
    ipfs: getIpfsUrl(cid, 'https://ipfs.io/ipfs/'),
    cloudflare: getIpfsUrl(cid, 'https://cloudflare-ipfs.com/ipfs/'),
    infura: getIpfsUrl(cid, 'https://ipfs.infura.io/ipfs/'),
    pinata: getIpfsUrl(cid, 'https://gateway.pinata.cloud/ipfs/'),
    dweb: getIpfsUrl(cid, 'https://dweb.link/ipfs/'),
  }
}

/**
 * Upload multiple files to IPFS
 * @param files - Array of File objects
 * @returns Array of IPFS hashes (CIDs)
 */
export const uploadMultipleFilesToIpfs = async (files: File[]): Promise<string[]> => {
  const ipfs = await getIpfsClient()
  
  try {
    const results = await Promise.all(
      files.map(async (file) => {
        const fileBuffer = await file.arrayBuffer()
        const result = await ipfs.add(fileBuffer)
        return result.cid.toString()
      })
    )
    
    return results
  } catch (error) {
    console.error('Error uploading multiple files to IPFS:', error)
    throw error
  }
}

/**
 * Check if CID is valid
 * @param cid - IPFS content identifier
 * @returns Boolean indicating validity
 */
export const isValidCid = (cid: string): boolean => {
  try {
    // Basic CID validation
    const cidPattern = /^[Qb][a-zA-Z0-9]{44,48}$|^[b-zB-Z1-9][a-zA-Z0-9]{39,}$/
    return cidPattern.test(cid)
  } catch (error) {
    return false
  }
}

/**
 * Upload file and return metadata
 * @param file - File object to upload
 * @returns Object with CID, size, and type
 */
export const uploadFileWithMetadata = async (file: File) => {
  const ipfs = await getIpfsClient()
  
  try {
    const fileBuffer = await file.arrayBuffer()
    const result = await ipfs.add(fileBuffer, {
      progress: (bytes) => {
        console.log(`Uploaded ${bytes} bytes`)
      },
    })
    
    return {
      cid: result.cid.toString(),
      size: result.size,
      path: result.path,
      type: file.type,
      name: file.name,
    }
  } catch (error) {
    console.error('Error uploading file with metadata to IPFS:', error)
    throw error
  }
}

/**
 * Delete content from local IPFS node (doesn't delete from network)
 * @param cid - IPFS content identifier
 */
export const unpinFromLocalNode = async (cid: string): Promise<void> => {
  const ipfs = await getIpfsClient()
  
  try {
    await ipfs.pin.rm(cid)
  } catch (error) {
    console.error('Error unpinning from local node:', error)
    throw error
  }
}

/**
 * Get IPFS statistics
 * @returns IPFS node statistics
 */
export const getIpfsStats = async () => {
  const ipfs = await getIpfsClient()
  
  try {
    const stats = await ipfs.stats.bitswap()
    return stats
  } catch (error) {
    console.error('Error getting IPFS stats:', error)
    throw error
  }
}

