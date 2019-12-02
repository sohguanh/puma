const AsyncLock = require('async-lock')

class TokenBucket {
  /*
  maximum_amt parameter to indicate how many request the url endpoint can handle before rejecting.
  refill_duration_sec parameter to indicate elapsed how many seconds before refilling.
  refill_amt to indicate how many to refill. any value that exceed maximum_amt will still be capped to maximum_amt.
  */
  constructor (maximumAmt = 30, refillDurationSec = 30, refillAmt = 5) {
    this.maximumAmt = maximumAmt
    this.currentAmt = maximumAmt
    this.refillDurationSec = refillDurationSec
    this.refillAmt = refillAmt
    this.lock = new AsyncLock()
  }

  startTimer () {
    this.inputParam = { lock: this.lock, maximumAmt: this.maximumAmt, currentAmt: this.currentAmt, refillAmt: this.refillAmt }
    this.timeout = setInterval(this.refill, this.refillDurationSec * 1000, this.inputParam)
  }

  stopTimer () {
    if (this.timeout !== undefined) {
      clearInterval(this.timeout)
    }
  }

  refill (inputParam) {
    inputParam.lock.acquire('token', () => {
      if (inputParam.currentAmt < inputParam.maximumAmt) {
        const newAmt = inputParam.currentAmt + inputParam.refillAmt
        if (newAmt > inputParam.maximumAmt) {
          inputParam.currentAmt = inputParam.maximumAmt
        } else {
          inputParam.currentAmt = newAmt
        }
      }
    }, {}).then(() => {
      // lock released
    })
  }

  isAllowed () {
    let allowed = true
    this.inputParam.lock.acquire('token', () => {
      if (this.inputParam.currentAmt > 0) {
        this.inputParam.currentAmt = this.inputParam.currentAmt - 1
        allowed = true
      } else {
        allowed = false
      }
    }, {}).then(() => {
      // lock released
    })
    return allowed
  }
}

module.exports = {
  TokenBucket
}
