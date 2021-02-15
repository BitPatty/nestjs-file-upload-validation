import * as fs from 'fs';
import * as path from 'path';

import { MAGIC_MIME_TYPE, Magic } from 'mmmagic';

import { file as initTmpFile } from 'tmp';

/**
 * Performs operations on the local file system
 */
class FileHandler {
  private static magic = new Magic(MAGIC_MIME_TYPE);

  /**
   * Validates if the magic number of a local file is part of
   * the specified whitelist
   * @param filePath The path to the file which should be checked
   * @param descriptorWhitelist The whitelist of magic numbers
   *
   * @returns Returns true if the magic number is part of the whitelist,
   * otherwise returns false
   */
  public static async validateMagicNumber(filePath: string, descriptorWhitelist: string[]) {
    return new Promise((resolve, reject) => {
      this.magic.detectFile(filePath, (err: Error, result: string) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log('detected filetype ', result);
          resolve(descriptorWhitelist.includes(result));
        }
      });
    });
  }

  /**
   * Extracts the file extension from the given file name
   * @param fileName The file name
   */
  public static parseFileExtension(fileName: string): string {
    return path.extname(fileName).toLowerCase();
  }

  /**
   * Creates a file in the default temp directory based on the
   * template specified.
   * @param template A mkstemp-style filename template
   */
  public static async createTempFile(template: string): Promise<string> {
    return new Promise((resolve, reject) =>
      initTmpFile(
        {
          // Restrict access to file owner
          // (aka this process)
          mode: 0o600,

          // The filename template
          template,

          // Close the file descriptor
          // after the file is created
          discardDescriptor: true,
        },
        (err: any, path: string) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve(path);
          }
        },
      ),
    );
  }

  /**
   * Delets a file from the local file system
   * @param filePath The path to the file which shoul dbe deleted
   */
  public static async deleteFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err);
          reject(err);
        } else resolve();
      });
    });
  }
}

export default FileHandler;
