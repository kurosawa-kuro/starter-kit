package test

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestAssertBasic(t *testing.T) {
	assert := assert.New(t)

	assert.Equal(123, 123, "数値が一致すること")
	assert.NotEqual(123, 456, "数値が異なること")
	assert.True(1 < 2, "1は2より小さい")
	assert.False(2 < 1, "2は1より小さくない")
	assert.Nil(nil, "nilであること")
	assert.NotNil(t, "tはnilではない")
}
